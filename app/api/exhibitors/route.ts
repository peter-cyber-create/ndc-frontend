import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
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
    if (!organization_name || !contact_person || !email || !phone || !selected_package) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database - only using columns that exist in schema
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await (connection as any).execute(
      `INSERT INTO exhibitors (
        company_name, contact_person, email, phone, selected_package, status, created_at
      ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        organization_name, contact_person, email, phone, selected_package
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
    
    const [rows] = await (connection as any).execute(
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

