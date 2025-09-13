import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called')
    
    const formData = await request.formData()
    console.log('Form data received:', Object.fromEntries(formData.entries()))
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const institution = formData.get('institution') as string // Changed from 'organization' to 'institution'
    const position = formData.get('position') as string
    const country = formData.get('country') as string
    const city = formData.get('city') as string
    const registrationType = formData.get('registrationType') as string
    const specialRequirements = formData.get('specialRequirements') as string
    const paymentProof = formData.get('paymentProof') as File | null

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !institution || !position || !country || !city || !registrationType || !paymentProof) {
      return NextResponse.json(
        { error: 'All required fields must be filled and payment proof must be uploaded' },
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

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)
    
    // Insert registration
    const [result] = await connection.execute(
      `INSERT INTO registrations 
       (firstName, lastName, email, phone, institution, position, registrationType, paymentProofUrl, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [firstName, lastName, email, phone, institution, position, registrationType, paymentProofUrl]
    )
    
    await connection.end()
    
    console.log('Registration saved successfully:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      registrationId: (result as any).insertId
    })
    
  } catch (error) {
    console.error('Error saving registration:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to submit registration: ${errorMessage}` },
      { status: 500 }
    )
  }
}
