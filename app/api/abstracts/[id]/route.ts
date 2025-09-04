import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = DatabaseManager.getInstance()
    
    // Check if abstract exists
    const abstract = await db.executeOne(`
      SELECT id FROM abstracts WHERE id = ?
    `, [id])

    if (!abstract) {
      return NextResponse.json(
        { error: 'Abstract not found' },
        { status: 404 }
      )
    }

    // Delete abstract
    await db.execute(`
      DELETE FROM abstracts WHERE id = ?
    `, [id])

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
