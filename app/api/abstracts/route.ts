import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function POST(request: NextRequest) {
  try {
    console.log('Abstract API called')
    
    const formData = await request.formData()
    console.log('Form data received:', Object.fromEntries(formData.entries()))
    
    // Extract all form fields
    const title = formData.get('title') as string
    const presentationType = formData.get('presentationType') as string
    const conferenceTrack = formData.get('conferenceTrack') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const institution = formData.get('institution') as string
    const position = formData.get('position') as string
    const district = formData.get('district') as string
    const coAuthors = formData.get('coAuthors') as string
    const abstractSummary = formData.get('abstractSummary') as string
    const keywords = formData.get('keywords') as string
    const background = formData.get('background') as string
    const methods = formData.get('methods') as string
    const findings = formData.get('findings') as string
    const conclusion = formData.get('conclusion') as string
    const policyImplications = formData.get('policyImplications') as string
    const conflictOfInterest = formData.get('conflictOfInterest') === 'true'
    const ethicalApproval = formData.get('ethicalApproval') === 'true'
    const consentToPublish = formData.get('consentToPublish') === 'true'
    const file = formData.get('file') as File | null

    // Validate required fields
    if (!title || !presentationType || !conferenceTrack || !firstName || !lastName || 
        !email || !phone || !institution || !position || !district || !abstractSummary || 
        !keywords || !background || !methods || !findings || !conclusion || !consentToPublish) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
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

    // Handle file upload
    let fileUrl = null
    if (file && file.size > 0) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 2MB' },
          { status: 400 }
        )
      }

      const uploadsDir = join(process.cwd(), 'uploads', 'abstracts')
      const fileName = `${firstName}_${lastName}_${Date.now()}.${file.name.split('.').pop()}`
      const filePath = join(uploadsDir, fileName)
      
      // Ensure uploads directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      fileUrl = `/uploads/abstracts/${fileName}`
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)
    
    // Create primary author JSON
    const primaryAuthor = JSON.stringify({
      firstName,
      lastName,
      email,
      phone,
      institution,
      position,
      district
    })
    
    // Insert abstract using the exact column names from the database
    const [result] = await connection.execute(
      `INSERT INTO abstracts 
       (title, presentation_type, category, primary_author, co_authors, 
        abstract_summary, keywords, background, methods, findings, conclusion, 
        implications, file_url, conflict_of_interest, ethical_approval, 
        consent_to_publish, author_phone, corresponding_author, corresponding_email, 
        corresponding_phone, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())`,
      [
        title, presentationType, conferenceTrack, primaryAuthor, coAuthors,
        abstractSummary, keywords, background, methods, findings, conclusion,
        policyImplications, fileUrl, conflictOfInterest, ethicalApproval,
        consentToPublish, phone, `${firstName} ${lastName}`, email, phone
      ]
    )
    
    await connection.end()
    
    console.log('Abstract saved successfully:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Abstract submitted successfully',
      abstractId: (result as any).insertId
    })
    
  } catch (error) {
    console.error('Error saving abstract:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to submit abstract: ${errorMessage}` },
      { status: 500 }
    )
  }
}
