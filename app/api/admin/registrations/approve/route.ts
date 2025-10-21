import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { emailService } from '../../../../../lib/emailService'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function POST(request: NextRequest) {
  try {
    const { registrationId, status } = await request.json()
    
    if (!registrationId || !status) {
      return NextResponse.json(
        { error: 'Registration ID and status are required' },
        { status: 400 }
      )
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)
    
    // Update registration status
    await (connection as any).execute(
      'UPDATE registrations SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, registrationId]
    )
    
    // Get registration details for email
    const [rows] = await (connection as any).execute(
      'SELECT firstName, lastName, email FROM registrations WHERE id = ?',
      [registrationId]
    )
    
    await connection.end()
    
    const registration = (rows as any[])[0]
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    // Send email notifications based on status
    if (status === 'approved') {
      try {
        const emailSent = await emailService.sendRegistrationConfirmation(
          registration.email,
          `${registration.firstName} ${registration.lastName}`,
          registrationId
        )
        
        if (!emailSent) {
          console.error('Failed to send approval email')
        }
      } catch (emailError) {
        console.error('Error sending approval email:', emailError)
      }
    } else if (status === 'rejected') {
      try {
        const emailSent = await emailService.sendRegistrationRejection(
          registration.email,
          `${registration.firstName} ${registration.lastName}`,
          registrationId
        )
        
        if (!emailSent) {
          console.error('Failed to send rejection email')
        }
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Registration ${status} successfully${status === 'approved' ? '. Approval email sent to participant.' : status === 'rejected' ? '. Rejection email sent to participant.' : ''}`
    })
    
  } catch (error) {
    console.error('Error updating registration status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to update registration status: ${errorMessage}` },
      { status: 500 }
    )
  }
}
