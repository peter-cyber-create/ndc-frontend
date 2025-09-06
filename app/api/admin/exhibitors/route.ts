import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: parseInt(process.env.DB_PORT || '3306'),
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


