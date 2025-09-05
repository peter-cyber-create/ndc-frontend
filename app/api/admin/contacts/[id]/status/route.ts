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
    
    const contactId = params.id
    const { status } = await request.json()
    
    console.log('Updating contact status:', { contactId, status })
    
    // Check if contact exists
    const [existing] = await connection.execute(
      'SELECT id FROM contacts WHERE id = ?',
      [contactId]
    )
    
    if (!Array.isArray(existing) || existing.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    // Update the contact status
    await connection.execute(
      'UPDATE contacts SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, contactId]
    )
    
    await connection.end()
    
    console.log('Contact status updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Contact status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating contact status:', error)
    return NextResponse.json(
      { error: 'Failed to update contact status' },
      { status: 500 }
    )
  }
}
