import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ndc_conference',
  port: parseInt(process.env.DB_PORT || '3306'),
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await (connection as any).execute(
      'DELETE FROM exhibitors WHERE id = ?',
      [id]
    )

    await connection.end()

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Exhibitor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Exhibitor deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting exhibitor:', error)
    return NextResponse.json(
      { error: 'Failed to delete exhibitor' },
      { status: 500 }
    )
  }
}


