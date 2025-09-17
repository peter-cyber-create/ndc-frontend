import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    // Check if submitted_at column exists
    const [submittedAtCheck] = await (connection as any).execute(`
      SELECT COUNT(*) as count FROM information_schema.columns 
      WHERE table_name = 'sponsorships' AND column_name = 'submitted_at'
    `)
    const hasSubmittedAt = (submittedAtCheck as any[])[0].count > 0
    
    const submittedAtField = hasSubmittedAt ? 'submitted_at,' : ''
    const [rows] = await (connection as any).execute(`
      SELECT id, company_name, contact_person, email, phone, selected_package, 
             status, ${submittedAtField} created_at
      FROM sponsorships ORDER BY created_at DESC
    `)
    await connection.end()
    
    return NextResponse.json({
      success: true,
      data: rows
    })
    
  } catch (error) {
    console.error('Error fetching sponsorships:', error)
    return NextResponse.json({ error: "Failed to fetch sponsorships" }, { status: 500, headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0" } })
  }
}


