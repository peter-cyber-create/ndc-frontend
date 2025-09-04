import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    // Get all data
    const registrations = await db.execute('SELECT * FROM registrations') as any[]
    const abstracts = await db.execute('SELECT * FROM abstracts') as any[]
    const contacts = await db.execute('SELECT * FROM contacts') as any[]
    const sponsorships = await db.execute('SELECT * FROM sponsorships') as any[]

    // Calculate statistics
    const stats = {
      totalRegistrations: registrations.length,
      totalAbstracts: abstracts.length,
      totalContacts: contacts.length,
      totalSponsorships: sponsorships.length,
      recentRegistrations: registrations
        .filter((r: any) => r.status === 'submitted')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((r: any) => ({
          id: r.id,
          name: `${r.first_name} ${r.last_name}`,
          email: r.email,
          organization: r.organization,
          status: r.status,
          submittedAt: r.created_at
        })),
      recentAbstracts: abstracts
        .filter((a: any) => a.status === 'submitted')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          author: a.primary_author ? JSON.parse(a.primary_author).firstName + ' ' + JSON.parse(a.primary_author).lastName : 'Unknown',
          status: a.status,
          submittedAt: a.created_at
        })),
      recentContacts: contacts
        .filter((c: any) => c.status === 'submitted')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          organization: c.organization,
          status: c.status,
          submittedAt: c.created_at
        })),
      recentSponsorships: sponsorships
        .filter((s: any) => s.status === 'submitted')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((s: any) => ({
          id: s.id,
          companyName: s.company_name,
          contactPerson: s.contact_person,
          email: s.email,
          status: s.status,
          submittedAt: s.created_at
        }))
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
