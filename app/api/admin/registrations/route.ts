import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
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
        first_name as firstName,
        last_name as lastName,
        email,
        phone,
        organization,
        position,
        registration_type as registrationType,
        payment_proof_url as paymentProofUrl,
        status,
        created_at as createdAt,
        updated_at as updatedAt
       FROM registrations 
       ORDER BY created_at DESC`
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      data: rows
    })
    
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
