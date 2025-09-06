import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, organization, inquiry_type, message } = await request.json()
    
    const connection = await mysql.createConnection(dbConfig)
    await connection.execute(`
      INSERT INTO contacts (name, email, phone, organization, inquiry_type, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
    `, [name, email, phone, organization, inquiry_type, message])
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    })
    
  } catch (error) {
    console.error('Error submitting contact:', error)
    return NextResponse.json({ error: "Failed to submit contact" }, { status: 500 })
  }
}


