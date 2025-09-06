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
    console.log('Admin contacts API - DB Config:', dbConfig)
    const connection = await mysql.createConnection(dbConfig)
    
    // First, let's check the total count
    const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM contacts`)
    console.log('Total contacts in database:', (countResult as any[])[0].total)
    
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
    
    console.log('Returning contacts count:', (rows as any[]).length)
    
    return NextResponse.json({
      success: true,
      data: rows
    })
    
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}


