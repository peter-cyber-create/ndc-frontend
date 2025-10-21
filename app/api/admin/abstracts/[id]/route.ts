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
    
    const abstractId = params.id
    
    // Check if abstract exists
    const [existing] = await (connection as any).execute(
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
    
    // Delete the abstract
    await (connection as any).execute(
      'DELETE FROM abstracts WHERE id = ?',
      [abstractId]
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Abstract deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting abstract:', error)
    return NextResponse.json(
      { error: 'Failed to delete abstract' },
      { status: 500 }
    )
  }
}