import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    // Get all data using proper type casting
    const [registrations] = await (connection as any).execute('SELECT * FROM registrations')
    const [abstracts] = await (connection as any).execute('SELECT * FROM abstracts')
    console.log("DEBUG: Total abstracts from DB:", (abstracts as any[]).length);
    const [contacts] = await (connection as any).execute('SELECT * FROM contacts')
    const [sponsorships] = await (connection as any).execute('SELECT * FROM sponsorships')
    const [exhibitors] = await (connection as any).execute('SELECT * FROM exhibitors')
    const [preConference] = await (connection as any).execute('SELECT * FROM pre_conference_meetings')
    
    await connection.end()

    // Calculate statistics
    const registrationsArray = registrations as any[]
    const abstractsArray = abstracts as any[]
    const contactsArray = contacts as any[]
    const sponsorshipsArray = sponsorships as any[]
    const exhibitorsArray = exhibitors as any[]
    const preConferenceArray = preConference as any[]
    
    const stats = {
      totalRegistrations: registrationsArray.length,
      totalAbstracts: abstractsArray.length,
      totalContacts: contactsArray.length,
      totalSponsorships: sponsorshipsArray.length,
      totalExhibitors: exhibitorsArray.length,
      totalPreConference: preConferenceArray.length,
      
      // Status breakdown
      registrationsByStatus: {
        pending: registrationsArray.filter((r: any) => r.status === 'pending').length,
        approved: registrationsArray.filter((r: any) => r.status === 'approved').length,
        rejected: registrationsArray.filter((r: any) => r.status === 'rejected').length,
      },
      
      abstractsByStatus: {
        submitted: abstractsArray.filter((a: any) => a.status === 'submitted').length,
        approved: abstractsArray.filter((a: any) => a.status === 'approved').length,
        rejected: abstractsArray.filter((a: any) => a.status === 'rejected').length,
      },
      
      sponsorshipsByStatus: {
        pending: sponsorshipsArray.filter((s: any) => s.status === 'pending').length,
        approved: sponsorshipsArray.filter((s: any) => s.status === 'approved').length,
        rejected: sponsorshipsArray.filter((s: any) => s.status === 'rejected').length,
      },
      
      exhibitorsByStatus: {
        pending: exhibitorsArray.filter((e: any) => e.status === 'pending').length,
        approved: exhibitorsArray.filter((e: any) => e.status === 'approved').length,
        rejected: exhibitorsArray.filter((e: any) => e.status === 'rejected').length,
      },
      
      preConferenceByStatus: {
        pending: preConferenceArray.filter((p: any) => p.status === 'pending').length,
        approved: preConferenceArray.filter((p: any) => p.status === 'approved').length,
        rejected: preConferenceArray.filter((p: any) => p.status === 'rejected').length,
      },
      
      // Recent activity
      recentRegistrations: registrationsArray
        .filter((r: any) => r.status === 'pending')
        .sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime())
        .slice(0, 5)
        .map((r: any) => ({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          email: r.email,
          organization: r.organization,
          status: r.status,
          submittedAt: r.createdAt || r.created_at
        })),
      recentAbstracts: abstractsArray
        .filter((a: any) => a.status === 'submitted')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          author: a.primary_author || 'Unknown',
          status: a.status,
          submittedAt: a.created_at
        })),
      recentContacts: contactsArray
        .filter((c: any) => c.status === 'new')
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
      recentSponsorships: sponsorshipsArray
        .filter((s: any) => s.status === 'pending')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((s: any) => ({
          id: s.id,
          companyName: s.company_name,
          contactPerson: s.contact_person,
          email: s.email,
          status: s.status,
          submittedAt: s.created_at
        })),
      recentExhibitors: exhibitorsArray
        .filter((e: any) => e.status === 'pending')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((e: any) => ({
          id: e.id,
          companyName: e.company_name,
          contactPerson: e.contact_person,
          email: e.email,
          package: e.selected_package,
          status: e.status,
          submittedAt: e.created_at
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
