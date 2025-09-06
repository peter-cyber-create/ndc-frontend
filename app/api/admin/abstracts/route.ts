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
    // Check if cross_cutting_themes column exists
    const [crossCuttingCheck] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.columns 
      WHERE table_name = 'abstracts' AND column_name = 'cross_cutting_themes'
    `)
    const hasCrossCutting = (crossCuttingCheck as any[])[0].count > 0
    
    const crossCuttingField = hasCrossCutting ? 'cross_cutting_themes,' : ''
    const [rows] = await connection.execute(`
      SELECT id, title, presentation_type, category, subcategory, ${crossCuttingField}
             primary_author, co_authors, abstract_summary, keywords, background,
             methods, findings, conclusion, implications, conflict_of_interest,
             ethical_approval, consent_to_publish, file_url, status, admin_notes,
             reviewer_comments, reviewed_by, reviewed_at, created_at, updated_at,
             author_phone, author_address, corresponding_author, corresponding_email, corresponding_phone
      FROM abstracts ORDER BY created_at DESC
    `)
    await connection.end()
    
    return NextResponse.json({
      success: true,
      data: rows
    })
    
  } catch (error) {
    console.error('Error fetching abstracts:', error)
    return NextResponse.json({ error: "Failed to fetch abstracts" }, { status: 500 })
  }
}