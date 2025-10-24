import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { emailService } from '../../../lib/emailService'

export const dynamic = 'force-dynamic'

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called')
    console.log('Content-Type:', request.headers.get('content-type'))
    
    const formData = await request.formData()
    console.log('Form data received:', Object.fromEntries(formData.entries()))
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const organization = formData.get('institution') as string // Form sends 'institution', DB expects 'organization'
    const position = formData.get('position') as string
    const country = formData.get('country') as string
    const city = formData.get('city') as string
    const registrationType = formData.get('registrationType') as string
    const specialRequirements = formData.get('specialRequirements') as string
    const paymentProof = formData.get('paymentProof') as File | null
    const passportPhoto = formData.get('passportPhoto') as File | null

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !organization || !position || !country || !city || !registrationType || !paymentProof || !passportPhoto) {
      return NextResponse.json(
        { error: 'All required fields must be filled and both payment proof and passport photo must be uploaded' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Handle payment proof upload
    let paymentProofUrl = null
    if (paymentProof && paymentProof.size > 0) {
      const uploadsDir = join(process.cwd(), 'uploads', 'payment-proofs')
      const fileName = `${firstName}_${lastName}_${Date.now()}.${paymentProof.name.split('.').pop()}`
      const filePath = join(uploadsDir, fileName)
      
      // Ensure uploads directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const bytes = await paymentProof.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      paymentProofUrl = `/uploads/payment-proofs/${fileName}`
    }

    // Handle passport photo upload
    let passportPhotoUrl = null
    if (passportPhoto && passportPhoto.size > 0) {
      const uploadsDir = join(process.cwd(), 'uploads', 'passport-photos')
      const fileName = `${firstName}_${lastName}_passport_${Date.now()}.${passportPhoto.name.split('.').pop()}`
      const filePath = join(uploadsDir, fileName)
      
      // Ensure uploads directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const bytes = await passportPhoto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      passportPhotoUrl = `/uploads/passport-photos/${fileName}`
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)
    
    // Insert registration
    const [result] = await (connection as any).execute(
      `INSERT INTO registrations 
       (firstName, lastName, email, phone, organization, position, registrationType, paymentProofUrl, passportPhotoUrl, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [firstName, lastName, email, phone, organization, position, registrationType, paymentProofUrl, passportPhotoUrl]
    )
    
    const registrationId = (result as any).insertId
    
    await connection.end()
    
    console.log('Registration saved successfully:', result)
    
    // Send confirmation email
    try {
      const emailSent = await emailService.sendRegistrationConfirmation(
        email,
        `${firstName} ${lastName}`,
        registrationId
      )
      
      if (!emailSent) {
        console.error('Failed to send confirmation email')
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! A confirmation email has been sent to your email address.',
      registrationId
    })
    
  } catch (error) {
    console.error('Error saving registration:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: `Failed to submit registration: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
