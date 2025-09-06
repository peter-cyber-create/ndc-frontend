import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ndc_conference',
  port: parseInt(process.env.DB_PORT || '3306'),
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    if (!status || !['submitted', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      'UPDATE exhibitors SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
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
      message: 'Exhibitor status updated successfully'
    })

  } catch (error) {
    console.error('Error updating exhibitor status:', error)
    return NextResponse.json(
      { error: 'Failed to update exhibitor status' },
      { status: 500 }
    )
  }
}

