import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const contacts = await db.execute(`
      SELECT id, name, email, organization, subject, message, inquiry_type, status, created_at
      FROM contacts 
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DatabaseManager.getInstance()
    
    const result = await db.execute(`
      INSERT INTO contacts (
        name, email, organization, subject, message, inquiry_type, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'submitted', NOW())
    `, [
      body.name,
      body.email,
      body.organization,
      body.subject || 'General Inquiry',
      body.message,
      body.inquiryType || 'general'
    ])
    const newContact = { id: result.insertId, ...body }
    
    return NextResponse.json({
      success: true,
      contact: newContact
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}
