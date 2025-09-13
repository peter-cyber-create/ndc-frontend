import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const [rows] = await connection.execute(
      `SELECT 
        id,
        firstName,
        lastName,
        email,
        phone,
        institution,
        position,
        registrationType,
        paymentProofUrl,
        status,
        createdAt,
        updatedAt
       FROM registrations 
       ORDER BY createdAt DESC`
    )
    
    await connection.end()
    
    const response = NextResponse.json({
      success: true,
      data: rows
    })
    
    // Add cache-control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
    
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
