import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const db = DatabaseManager.getInstance()
    
    // Update registration status
    await db.execute(`
      UPDATE registrations 
      SET status = ?, updated_at = NOW() 
      WHERE id = ?
    `, [status, id])

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
