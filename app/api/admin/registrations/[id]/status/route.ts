import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
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
    
    const registrationId = params.id
    const { status } = await request.json()
    
    console.log('Updating registration status:', { registrationId, status })
    
    // Check if registration exists
    const [existing] = await connection.execute(
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
    
    // Update the registration status
    await connection.execute(
      'UPDATE registrations SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, registrationId]
    )
    
    await connection.end()
    
    console.log('Registration status updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Registration status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating registration status:', error)
    return NextResponse.json(
      { error: 'Failed to update registration status' },
      { status: 500 }
    )
  }
}
