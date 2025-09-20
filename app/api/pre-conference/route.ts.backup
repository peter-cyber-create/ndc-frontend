import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { emailService } from '../../../lib/emailService'

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
    const data: PreConferenceMeetingData = await request.json()

    // Validate required fields
    const requiredFields = [
      'sessionTitle', 'sessionDescription', 'meetingType', 'organizerName',
      'organizerEmail', 'organizerPhone', 'organization', 'meetingDate',
      'meetingTimeStart', 'meetingTimeEnd', 'expectedAttendees', 'roomSize',
      'locationPreference', 'abstractText', 'keywords'
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check submission deadline (September 30, 2025)
    const submissionDeadline = new Date('2025-09-30T23:59:59Z')
    const currentDate = new Date()
    
    if (currentDate > submissionDeadline) {
      return NextResponse.json(
        { message: 'Submission deadline has passed. The deadline was September 30th, 2025.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.organizerEmail)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate expected attendees is a number
    const attendees = parseInt(data.expectedAttendees)
    if (isNaN(attendees) || attendees <= 0) {
      return NextResponse.json(
        { message: 'Expected attendees must be a positive number' },
        { status: 400 }
      )
    }

    // Validate time format (basic check)
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
          abstract_text, keywords, special_requirements, payment_amount, approval_status, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.sessionTitle,
          data.sessionDescription,
          data.meetingType,
          data.organizerName,
          data.organizerEmail,
          data.organizerPhone,
          data.organization,
          data.coOrganizers || '',
          data.meetingDate,
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
          'pending',
          'pending'
        ]
      )

      if ('insertId' in result) {
        const submissionId = result.insertId as number
        
        // Send confirmation email (implement email service integration here)
        try {
          await sendConfirmationEmail({ ...data, id: submissionId })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
          // Don't fail the registration if email fails
        }

        return NextResponse.json(
          { 
            message: 'Pre-conference meeting submitted successfully',
            submissionId: submissionId
          },
          { status: 201 }
        )
      } else {
        throw new Error('Failed to insert record')
      }

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizerEmail = searchParams.get('email')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const connection = await mysql.createConnection(dbConfig)

    try {
      let query = 'SELECT * FROM pre_conference_meetings WHERE 1=1'
      const params: any[] = []

      if (organizerEmail) {
        query += ' AND organizer_email = ?'
        params.push(organizerEmail)
      }

      if (status) {
        query += ' AND approval_status = ?'
        params.push(status)
      }

      query += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?'
      params.push(limit, offset)

      const [meetings] = await (connection as any).execute(query, params)

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM pre_conference_meetings WHERE 1=1'
      const countParams: any[] = []

      if (organizerEmail) {
        countQuery += ' AND organizer_email = ?'
        countParams.push(organizerEmail)
      }

      if (status) {
        countQuery += ' AND approval_status = ?'
        countParams.push(status)
      }

      const [countResult] = await (connection as any).execute(countQuery, countParams)
      const total = Array.isArray(countResult) && countResult.length > 0 ? 
        (countResult[0] as any).total : 0

      return NextResponse.json({
        meetings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error fetching pre-conference meetings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}

async function sendConfirmationEmail(data: PreConferenceMeetingData & { id?: number }) {
  try {
    const success = await emailService.sendPreConferenceMeetingConfirmation(
      data.organizerEmail,
      data.organizerName,
      data.sessionTitle,
      data.meetingDate.replace('_', ' ').replace('november', 'November'),
      data.meetingType,
      data.id || 0
    )
    
    if (!success) {
      throw new Error('Failed to send confirmation email')
    }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}
