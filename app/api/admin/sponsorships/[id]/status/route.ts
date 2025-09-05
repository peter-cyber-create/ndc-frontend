import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const sponsorshipId = params.id
    const { status } = await request.json()
    
    console.log('Updating sponsorship status:', { sponsorshipId, status })
    
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
    
    // Update the sponsorship status
    await connection.execute(
      'UPDATE sponsorships SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, sponsorshipId]
    )
    
    await connection.end()
    
    console.log('Sponsorship status updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Sponsorship status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating sponsorship status:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsorship status' },
      { status: 500 }
    )
  }
}
