import { NextResponse } from "next/server"
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

    const [rows] = await (connection as any).execute('SELECT * FROM pre_conference_meetings ORDER BY submitted_at DESC')

    await connection.end()

    return NextResponse.json({
      success: true,
      meetings: rows,
      pagination: {
        page: 1,
        limit: rows.length,
        total: rows.length,
        totalPages: 1
      }
    })

  } catch (error) {
    console.error('Error fetching pre-conference meetings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pre-conference meetings' },
      { status: 500 }
    )
  }
}
