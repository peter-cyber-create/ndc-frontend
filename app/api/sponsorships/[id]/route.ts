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
    
    // Check if sponsorship exists
    const sponsorship = await db.executeOne(`
      SELECT id FROM sponsorships WHERE id = ?
    `, [id])

    if (!sponsorship) {
      return NextResponse.json(
        { error: 'Sponsorship not found' },
        { status: 404 }
      )
    }

    // Delete sponsorship
    await db.execute(`
      DELETE FROM sponsorships WHERE id = ?
    `, [id])

    return NextResponse.json({
      success: true,
      message: 'Sponsorship deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsorship' },
      { status: 500 }
    )
  }
}
