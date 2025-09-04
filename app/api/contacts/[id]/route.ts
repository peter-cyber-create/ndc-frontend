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
    
    // Check if contact exists
    const contact = await db.executeOne(`
      SELECT id FROM contacts WHERE id = ?
    `, [id])

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Delete contact
    await db.execute(`
      DELETE FROM contacts WHERE id = ?
    `, [id])

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
