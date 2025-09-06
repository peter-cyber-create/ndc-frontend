import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

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
    
    const organization_name = formData.get('organizationName') as string
    const contact_person = formData.get('contactPerson') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const website = formData.get('website') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const country = formData.get('country') as string
    const selected_package = formData.get('selected_package') as string
    const additionalInfo = formData.get('additionalInfo') as string
    const paymentProof = formData.get('paymentProof') as File

    // Validate required fields
    if (!organization_name || !contact_person || !email || !phone || !selected_package || !paymentProof) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle file upload
    let payment_proof_url = ''
    if (paymentProof && paymentProof.size > 0) {
      const bytes = await paymentProof.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'exhibition-payments')
      await mkdir(uploadsDir, { recursive: true })
      
      // Generate unique filename
      const timestamp = Date.now()
      const originalName = paymentProof.name
      const extension = path.extname(originalName)
      const filename = `exhibition_${timestamp}_${originalName}`
      const filepath = path.join(uploadsDir, filename)
      
      await writeFile(filepath, buffer)
      payment_proof_url = `/uploads/exhibition-payments/${filename}`
    }

    // Get package price
    const packagePrices: { [key: string]: number } = {
      'platinum': 10000,
      'gold': 7000,
      'silver': 5000,
      'bronze': 4000,
      'nonprofit': 2500
    }

    const amount = packagePrices[selected_package] || 0

    // Save to database
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      `INSERT INTO exhibitors (
        company_name, contact_person, email, phone, address, city, country, 
        selected_package, additional_info, payment_proof_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        organization_name, contact_person, email, phone, address, city, country,
        selected_package, additionalInfo, payment_proof_url
      ]
    )

    await connection.end()

    return NextResponse.json({
      success: true,
      message: 'Exhibition application submitted successfully',
      id: (result as any).insertId
    })

  } catch (error) {
    console.error('Error submitting exhibition application:', error)
    return NextResponse.json(
      { error: 'Failed to submit exhibition application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const [rows] = await connection.execute(
      'SELECT * FROM exhibitors ORDER BY created_at DESC'
    )
    
    await connection.end()

    return NextResponse.json({
      success: true,
      exhibitors: rows
    })

  } catch (error) {
    console.error('Error fetching exhibitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exhibitors' },
      { status: 500 }
    )
  }
}

