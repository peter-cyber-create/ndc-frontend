import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    // Check if phone column exists
    const [phoneCheck] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.columns 
      WHERE table_name = 'contacts' AND column_name = 'phone'
    `)
    const hasPhone = (phoneCheck as any[])[0].count > 0
    
    const phoneField = hasPhone ? 'phone,' : ''
    const [rows] = await connection.execute(`
      SELECT id, name, email, ${phoneField} organization, inquiry_type, message, status, created_at
      FROM contacts ORDER BY created_at DESC
    `)
    await connection.end()
    
    return NextResponse.json({
      success: true,
      data: rows
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}


