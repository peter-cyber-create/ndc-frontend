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
    console.log('Starting abstracts API request...')
    const connection = await mysql.createConnection(dbConfig)
    console.log('Database connection established')
    
    // Check if cross_cutting_themes column exists
    const [crossCuttingCheck] = await (connection as any).execute(`
      SELECT COUNT(*) as count FROM information_schema.columns 
      WHERE table_name = 'abstracts' AND column_name = 'cross_cutting_themes'
    `)
    const hasCrossCutting = (crossCuttingCheck as any[])[0].count > 0
    console.log('Cross cutting check completed, has column:', hasCrossCutting)
    
    const crossCuttingField = hasCrossCutting ? 'cross_cutting_themes,' : ''
    const [rows] = await (connection as any).execute(`
      SELECT id, title, presentation_type, category, subcategory, ${crossCuttingField}
             primary_author, co_authors, abstract_summary, keywords, background,
             methods, findings, conclusion, implications, conflict_of_interest,
             ethical_approval, consent_to_publish, file_url, status, admin_notes,
             reviewer_comments, reviewed_by, reviewed_at, created_at, updated_at,
             author_phone, author_address, corresponding_author, corresponding_email, corresponding_phone
      FROM abstracts ORDER BY created_at DESC
    `)
    
    console.log('Query completed, rows returned:', (rows as any[]).length)
    console.log('First 5 IDs:', (rows as any[]).slice(0, 5).map(r => r.id))
    console.log('Last 5 IDs:', (rows as any[]).slice(-5).map(r => r.id))
    
    await connection.end()
    console.log('Database connection closed')
    
    const response = NextResponse.json({
      success: true,
      data: rows
    })
    
    // Add cache-control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    console.log('Response created with no-cache headers, sending...')
    return response
    
  } catch (error) {
    console.error('Error fetching abstracts:', error)
    return NextResponse.json({ error: "Failed to fetch abstracts" }, { status: 500, headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0" } })
  }
}
