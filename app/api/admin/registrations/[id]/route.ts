import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
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
    
    const registrationId = params.id
    
    // Check if registration exists
    const [existing] = await (connection as any).execute(
      'SELECT id FROM registrations WHERE id = ?',
      [registrationId]
    )
    
    if (!Array.isArray(existing) || existing.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    // Delete the registration
    await (connection as any).execute(
      'DELETE FROM registrations WHERE id = ?',
      [registrationId]
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}
