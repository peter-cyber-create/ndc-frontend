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
    const formData = await request.formData()
    
    const company_name = formData.get('organizationName') as string
    const contact_person = formData.get('contactPerson') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const selected_package = formData.get('selected_package') as string
    const paymentProof = formData.get('paymentProof') as File
    
    if (!company_name || !contact_person || !email || !phone || !selected_package || !paymentProof) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Handle file upload
    let paymentProofUrl = null
    if (paymentProof && paymentProof.size > 0) {
      const bytes = await paymentProof.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const fileName = `sponsorship_${Date.now()}_${paymentProof.name}`
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'sponsorship-proof')
      
      // Ensure directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const filePath = join(uploadDir, fileName)
      await writeFile(filePath, buffer)
      paymentProofUrl = `/uploads/sponsorship-proof/${fileName}`
    }
    
    const connection = await mysql.createConnection(dbConfig)
    await connection.execute(`
      INSERT INTO sponsorships (company_name, contact_person, email, phone, selected_package, payment_proof_url, status, submitted_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `, [company_name, contact_person, email, phone, selected_package, paymentProofUrl])
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Sponsorship application submitted successfully'
    })
    
  } catch (error) {
    console.error('Error submitting sponsorship:', error)
    return NextResponse.json({ error: "Failed to submit sponsorship" }, { status: 500 })
  }
}
