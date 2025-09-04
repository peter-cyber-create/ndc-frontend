import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const sponsorships = await db.execute(`
      SELECT id, company_name, contact_person, email, phone, 
             selected_package, message, status, created_at
      FROM sponsorships 
      ORDER BY created_at DESC
    `)

    const transformedSponsorships = sponsorships.map((sponsorship: any) => ({
      id: sponsorship.id,
      companyName: sponsorship.company_name,
      contactPerson: sponsorship.contact_person,
      email: sponsorship.email,
      phone: sponsorship.phone,
      selectedPackage: sponsorship.selected_package,
      message: sponsorship.message,
      status: sponsorship.status,
      submittedAt: sponsorship.created_at
    }))

    return NextResponse.json({
      success: true,
      data: transformedSponsorships
    })
  } catch (error) {
    console.error('Error fetching sponsorships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsorships' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DatabaseManager.getInstance()
    
    const result = await db.execute(`
      INSERT INTO sponsorships (
        company_name, contact_person, email, phone, selected_package, message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'submitted', NOW())
    `, [
      body.companyName,
      body.contactPerson,
      body.email,
      body.phone,
      body.selectedPackage,
      body.message
    ])
    
    return NextResponse.json({
      success: true,
      sponsorship: { id: result.insertId, ...body }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsorship' },
      { status: 500 }
    )
  }
}
