import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { emailService } from '../../../../../lib/emailService'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = parseInt(params.id)
    if (isNaN(meetingId)) {
      return NextResponse.json(
        { message: 'Invalid meeting ID' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get the current meeting data
      const [meetingRows] = await (connection as any).execute(
        'SELECT * FROM pre_conference_meetings WHERE id = ?',
        [meetingId]
      )

      if (!Array.isArray(meetingRows) || meetingRows.length === 0) {
        return NextResponse.json(
          { message: 'Meeting not found' },
          { status: 404 }
        )
      }

      const meeting = meetingRows[0] as any

      // Build update query dynamically
      const updateFields: string[] = []
      const updateValues: any[] = []

      if (updateData.status !== undefined) {
        updateFields.push('status = ?')
        updateValues.push(updateData.status)
      }

      if (updateData.payment_status !== undefined) {
        updateFields.push('payment_status = ?')
        updateValues.push(updateData.payment_status)
      }

      if (updateData.admin_notes !== undefined) {
        updateFields.push('admin_notes = ?')
        updateValues.push(updateData.admin_notes)
      }

      if (updateData.approved_at !== undefined) {
        updateFields.push('approved_at = ?')
        updateValues.push(updateData.approved_at)
      }

      if (updateData.payment_received_at !== undefined) {
        updateFields.push('payment_received_at = ?')
        updateValues.push(updateData.payment_received_at)
      }

      if (updateData.cancellation_fee_applied !== undefined) {
        updateFields.push('cancellation_fee_applied = ?')
        updateValues.push(updateData.cancellation_fee_applied)
      }

      if (updateFields.length === 0) {
        return NextResponse.json(
          { message: 'No valid fields to update' },
          { status: 400 }
        )
      }

      // Always update the updated_at timestamp
      updateFields.push('updated_at = CURRENT_TIMESTAMP')
      updateValues.push(meetingId)

      const updateQuery = `UPDATE pre_conference_meetings SET ${updateFields.join(', ')} WHERE id = ?`

      await (connection as any).execute(updateQuery, updateValues)

      // Send notification email if status changed
      if (updateData.status && updateData.status !== meeting.status) {
        try {
          await sendStatusUpdateEmail(meeting, updateData.status, updateData.admin_notes)
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError)
          // Don't fail the update if email fails
        }
      }

      return NextResponse.json(
        { message: 'Meeting updated successfully' },
        { status: 200 }
      )

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error updating meeting:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = parseInt(params.id)
    if (isNaN(meetingId)) {
      return NextResponse.json(
        { message: 'Invalid meeting ID' },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Check if meeting exists
      const [meetingRows] = await (connection as any).execute(
        'SELECT * FROM pre_conference_meetings WHERE id = ?',
        [meetingId]
      )

      if (!Array.isArray(meetingRows) || meetingRows.length === 0) {
        return NextResponse.json(
          { message: 'Meeting not found' },
          { status: 404 }
        )
      }

      // Delete the meeting
      await (connection as any).execute(
        'DELETE FROM pre_conference_meetings WHERE id = ?',
        [meetingId]
      )

      return NextResponse.json(
        { message: 'Meeting deleted successfully' },
        { status: 200 }
      )

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error deleting meeting:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendStatusUpdateEmail(meeting: any, newStatus: string, adminNotes?: string) {
  const formatMeetingDate = (dateValue: string) => {
    return dateValue.replace('_', ' ').replace('november', 'November')
  }

  let emailSubject = ''
  let emailBody = ''

  if (newStatus === 'approved') {
    emailSubject = 'Pre-Conference Meeting Approved'
    emailBody = `
      <h2>Pre-Conference Meeting Approved</h2>
      <p>Dear ${meeting.organizer_name},</p>
      
      <p>Great news! Your pre-conference meeting proposal has been approved by our organizing committee.</p>
      
      <h3>Approved Session Details:</h3>
      <ul>
        <li><strong>Title:</strong> ${meeting.session_title}</li>
        <li><strong>Type:</strong> ${meeting.meeting_type}</li>
        <li><strong>Date:</strong> ${formatMeetingDate(meeting.meeting_date)}</li>
        <li><strong>Time:</strong> ${meeting.meeting_time_start} - ${meeting.meeting_time_end}</li>
        <li><strong>Expected Attendees:</strong> ${meeting.expected_attendees}</li>
      </ul>
      
      ${meeting.payment_amount > 0 ? `
      <h3>Payment Information:</h3>
      <p><strong>Amount Due:</strong> $${meeting.payment_amount}</p>
      <p>Please complete your payment within 7 days to secure your session slot. Payment instructions:</p>
      <ul>
        <li>Bank Transfer: Account details provided separately</li>
        <li>Mobile Money: +256-800-100-066</li>
        <li>Reference: Pre-Conf-${meeting.id}</li>
      </ul>
      ` : ''}
      
      <h3>Next Steps:</h3>
      <ul>
        <li>You will receive room assignment details closer to the conference date</li>
        <li>Please prepare any required materials or equipment lists</li>
        <li>Contact us if you need to make any changes to your session</li>
      </ul>
      
      ${adminNotes ? `
      <h3>Additional Notes:</h3>
      <p>${adminNotes}</p>
      ` : ''}
      
      <p>If you have any questions, please contact us at:</p>
      <ul>
        <li>Email: moh.conference@health.go.ug</li>
        <li>Phone: 0800-100-066</li>
      </ul>
      
      <p>Thank you for your participation in the National District Leaders Program Conference.</p>
      
      <p>Best regards,<br>
      The Conference Organizing Committee</p>
    `
  } else if (newStatus === 'rejected') {
    emailSubject = 'Pre-Conference Meeting Proposal Update'
    emailBody = `
      <h2>Pre-Conference Meeting Proposal Update</h2>
      <p>Dear ${meeting.organizer_name},</p>
      
      <p>Thank you for submitting your pre-conference meeting proposal. After careful review by our organizing committee, we regret to inform you that your proposal could not be accommodated at this time.</p>
      
      <h3>Submitted Session:</h3>
      <ul>
        <li><strong>Title:</strong> ${meeting.session_title}</li>
        <li><strong>Type:</strong> ${meeting.meeting_type}</li>
        <li><strong>Date:</strong> ${formatMeetingDate(meeting.meeting_date)}</li>
      </ul>
      
      ${adminNotes ? `
      <h3>Feedback:</h3>
      <p>${adminNotes}</p>
      ` : ''}
      
      <p>While we were unable to approve this particular proposal, we encourage you to:</p>
      <ul>
        <li>Attend the main conference sessions</li>
        <li>Consider proposing a session for future conferences</li>
        <li>Participate in networking opportunities during the conference</li>
      </ul>
      
      <p>If you have any questions or would like clarification on the decision, please don't hesitate to contact us.</p>
      
      <p>Contact Information:</p>
      <ul>
        <li>Email: moh.conference@health.go.ug</li>
        <li>Phone: 0800-100-066</li>
      </ul>
      
      <p>Thank you for your interest in contributing to the National District Leaders Program Conference.</p>
      
      <p>Best regards,<br>
      The Conference Organizing Committee</p>
    `
  }

  if (emailSubject && emailBody) {
    await emailService.sendEmail({
      to: meeting.organizer_email,
      subject: emailSubject,
      html: emailBody
    })
  }
}
