
import { NextRequest, NextResponse } from 'next/server'
import mysql, { Connection } from 'mysql2/promise'
import { emailService } from '../../../lib/emailService'
import { promises as fs } from 'fs'
import path from 'path'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

interface PreConferenceMeetingData {
  sessionTitle: string
  sessionDescription: string
  meetingType: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  organization: string
  coOrganizers: string
  meetingDate: string
  meetingTimeStart: string
  meetingTimeEnd: string
  sessionDuration: string
  expectedAttendees: string
  roomSize: string
  locationPreference: string
  abstractText: string
  keywords: string
  specialRequirements: string
  paymentAmount: number
}


export async function POST(request: NextRequest) {
  try {
    // Check content type for multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    let abstractFilePath = '';

    if (contentType.startsWith('multipart/form-data')) {
      // Parse multipart form data
      const formData = await request.formData();
      // Extract fields
      data = Object.fromEntries(formData.entries());
      // Handle file upload
      const file = formData.get('abstractFile');
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'pre-conference');
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        abstractFilePath = path.join('uploads', 'pre-conference', fileName);
        await fs.writeFile(path.join(process.cwd(), 'public', abstractFilePath), buffer);
        data.abstractFilePath = abstractFilePath;
      }
    } else {
      // fallback for JSON (should not be used by new frontend)
      const rawData = await request.json();
      data = {
        ...rawData,
        coOrganizers: rawData.coOrganizers ?? '',
        specialRequirements: rawData.specialRequirements ?? '',
        paymentAmount: typeof rawData.paymentAmount === 'number' ? rawData.paymentAmount : 0
      };
    }

    // Validate required fields
    const requiredFields = [
      'sessionTitle', 'sessionDescription', 'meetingType', 'organizerName',
      'organizerEmail', 'organizerPhone', 'organization', 'meetingDate',
      'meetingTimeStart', 'meetingTimeEnd', 'expectedAttendees', 'roomSize',
      'locationPreference', 'abstractText', 'keywords'
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    // If file upload is required, check for it
    if (!data.abstractFilePath) {
      return NextResponse.json(
        { message: 'Abstract file is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.organizerEmail)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate expected attendees
    const attendees = parseInt(data.expectedAttendees)
    if (isNaN(attendees) || attendees <= 0 || attendees > 200) {
      return NextResponse.json(
        { message: 'Expected attendees must be between 1 and 200' },
        { status: 400 }
      )
    }

    // Validate session duration
    const duration = parseInt(data.sessionDuration)
    if (isNaN(duration) || duration < 3) {
      return NextResponse.json(
        { message: 'Session duration must be at least 3 hours' },
        { status: 400 }
      )
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(data.meetingTimeStart) || !timeRegex.test(data.meetingTimeEnd)) {
      return NextResponse.json(
        { message: 'Please enter valid time format (HH:MM)' },
        { status: 400 }
      )
    }

    // Check if end time is after start time
    const startTime = new Date(`2000-01-01T${data.meetingTimeStart}:00`)
    const endTime = new Date(`2000-01-01T${data.meetingTimeEnd}:00`)
    if (endTime <= startTime) {
      return NextResponse.json(
        { message: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Connect to database
  const connection = await mysql.createConnection(dbConfig)

    try {
      // Check if email already has a pending or approved submission
  const [existingRecords] = await (connection as any).execute(
        'SELECT id FROM pre_conference_meetings WHERE organizer_email = ? AND approval_status IN (?, ?)',
        [data.organizerEmail, 'pending', 'approved']
      )

      if (Array.isArray(existingRecords) && existingRecords.length > 0) {
        return NextResponse.json(
          { message: 'You already have a pending or approved pre-conference meeting submission' },
          { status: 400 }
        )
      }

      // Insert the new pre-conference meeting
      const [result] = await (connection as any).execute(
        `INSERT INTO pre_conference_meetings (
          session_title, session_description, meeting_type, organizer_name, organizer_email,
          organizer_phone, organization, co_organizers, meeting_date, meeting_time_start,
          meeting_time_end, session_duration, expected_attendees, room_size, location_preference, 
          abstract_text, keywords, special_requirements, payment_amount, abstract_file_path, approval_status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          data.sessionTitle,
          data.sessionDescription,
          data.meetingType,
          data.organizerName,
          data.organizerEmail,
          data.organizerPhone,
          data.organization,
          data.coOrganizers || '',
          data.meetingDate === '2025-11-03' ? 'november_3' : data.meetingDate === '2025-11-04' ? 'november_4' : 'both_days',
          data.meetingTimeStart,
          data.meetingTimeEnd,
          parseInt(data.sessionDuration) || 3,
          parseInt(data.expectedAttendees),
          data.roomSize,
          data.locationPreference,
          data.abstractText,
          data.keywords,
          data.specialRequirements || '',
          data.paymentAmount,
          data.abstractFilePath || '',
          'pending'
        ]
      );

      const insertResult = result as mysql.ResultSetHeader
      
      // Send confirmation email (optional)
      try {
        await emailService.sendPreConferenceMeetingConfirmation(
          data.organizerEmail,
          data.organizerName,
          data.sessionTitle,
          data.meetingDate.replace('_', ' ').replace('november', 'November'),
          data.meetingType,
          insertResult.insertId
        );
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }

      return NextResponse.json(
        { 
          message: 'Pre-conference meeting submitted successfully',
          submissionId: insertResult.insertId
        },
        { status: 201 }
      )

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error processing pre-conference meeting submission:', error)
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
