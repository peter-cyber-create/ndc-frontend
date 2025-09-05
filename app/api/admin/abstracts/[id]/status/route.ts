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
    
    const abstractId = params.id
    const { status } = await request.json()
    
    console.log('Updating abstract status:', { abstractId, status })
    
    // Check if abstract exists
    const [existing] = await connection.execute(
      'SELECT id FROM abstracts WHERE id = ?',
      [abstractId]
    )
    
    if (!Array.isArray(existing) || existing.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Abstract not found' },
        { status: 404 }
      )
    }
    
    // Update the abstract status
    await connection.execute(
      'UPDATE abstracts SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, abstractId]
    )
    
    await connection.end()
    
    console.log('Abstract status updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Abstract status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating abstract status:', error)
    return NextResponse.json(
      { error: 'Failed to update abstract status' },
      { status: 500 }
    )
  }
}
