import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const sponsorshipId = params.id
    
    // Check if sponsorship exists
    const [existing] = await connection.execute(
      'SELECT id FROM sponsorships WHERE id = ?',
      [sponsorshipId]
    )
    
    if (!Array.isArray(existing) || existing.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Sponsorship not found' },
        { status: 404 }
      )
    }
    
    // Delete the sponsorship
    await connection.execute(
      'DELETE FROM sponsorships WHERE id = ?',
      [sponsorshipId]
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Sponsorship deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsorship' },
      { status: 500 }
    )
  }
}

