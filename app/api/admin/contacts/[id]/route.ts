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
    
    const contactId = params.id
    
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
    
    // Delete the contact
    await connection.execute(
      'DELETE FROM contacts WHERE id = ?',
      [contactId]
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}


