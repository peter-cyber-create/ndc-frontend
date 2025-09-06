import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute(`
      SELECT id, company_name, contact_person, email, phone, selected_package, 
             status, submitted_at, created_at
      FROM sponsorships ORDER BY created_at DESC
    `)
    await connection.end()
    
    return NextResponse.json({
      success: true,
      data: rows
    })
    
  } catch (error) {
    console.error('Error fetching sponsorships:', error)
    return NextResponse.json({ error: "Failed to fetch sponsorships" }, { status: 500 })
  }
}


