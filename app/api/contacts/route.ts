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

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, organization, inquiry_type, message } = await request.json()
    
    // Handle undefined values by providing defaults or null
    const safePhone = phone || null
    const safeOrganization = organization || null
    const safeInquiryType = inquiry_type || null
    
    const connection = await mysql.createConnection(dbConfig)
    await (connection as any).execute(`
      INSERT INTO contacts (name, email, phone, organization, inquiry_type, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
    `, [name, email, safePhone, safeOrganization, safeInquiryType, message])
    
    await connection.end()

    // Send confirmation email
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Contact Form Received',
        html: `<p>Dear ${name},<br>Your message has been received. We will get back to you soon.<br>Thank you!</p>`
      })
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    })

  } catch (error) {
    console.error('Error submitting contact:', error)
    return NextResponse.json({ error: "Failed to submit contact" }, { status: 500 })
  }
}