import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const registrations = await db.execute(`
      SELECT id, first_name, last_name, email, phone, organization, 
             position, registration_type, payment_proof_url, status, created_at
      FROM registrations 
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: registrations
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DatabaseManager.getInstance()
    
    const result = await db.execute(`
      INSERT INTO registrations (
        first_name, last_name, email, phone, organization, position, registration_type, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())
    `, [
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.organization,
      body.position,
      body.registrationType
    ])
    const newRegistration = { id: result.insertId, ...body }
    
    return NextResponse.json({
      success: true,
      registration: newRegistration
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
