import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

interface DatabaseAbstract {
  id: number
  title: string
  primary_author: string
  abstract_summary: string
  keywords: string
  category: string
  status: string
  file_url: string | null
  created_at: string
}

interface PrimaryAuthor {
  firstName?: string
  lastName?: string
  email?: string
  institution?: string
}

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const abstracts = await db.execute(`
      SELECT id, title, primary_author, abstract_summary, keywords, 
             category, status, file_url, created_at
      FROM abstracts 
      ORDER BY created_at DESC
    `) as DatabaseAbstract[]

    const transformedAbstracts = abstracts.map((abstract: any) => {
      let primaryAuthor: PrimaryAuthor = {}
      try {
        primaryAuthor = JSON.parse(abstract.primary_author || '{}') as any
      } catch (e) {
        console.error('Error parsing primary_author:', e, abstract.primary_author)
        primaryAuthor = {}
      }
      
      let keywords = []
      try {
        keywords = abstract.keywords ? JSON.parse(abstract.keywords) : []
      } catch (e) {
        console.error('Error parsing keywords:', e, abstract.keywords)
        keywords = []
      }
      
      let fileInfo = null
      try {
        fileInfo = abstract.file_url ? JSON.parse(abstract.file_url) : null
      } catch (e) {
        console.error('Error parsing file_url:', e, abstract.file_url)
        fileInfo = null
      }
      
      return {
        id: abstract.id,
        title: abstract.title,
        author: `${(primaryAuthor as any).firstName || 'Unknown'} ${(primaryAuthor as any).lastName || 'Author'}`,
        email: (primaryAuthor as any).email || 'N/A',
        organization: (primaryAuthor as any).institution || 'N/A',
        abstract: abstract.abstract_summary,
        keywords: keywords,
        category: abstract.category,
        status: abstract.status,
        filePath: fileInfo?.url || null,
        fileName: fileInfo?.name || null,
        fileSize: fileInfo?.size || null,
        submittedAt: abstract.created_at
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedAbstracts
    })
  } catch (error) {
    console.error('Error fetching abstracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abstracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DatabaseManager.getInstance()
    
    // Insert new abstract into database
    const result = await db.execute(`
      INSERT INTO abstracts (
        title, primary_author, abstract_summary, keywords, 
        category, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'submitted', NOW(), NOW())
    `, [
      body.title,
      JSON.stringify({
        firstName: body.author?.split(' ')[0] || 'Unknown',
        lastName: body.author?.split(' ').slice(1).join(' ') || 'Author',
        email: body.email || 'N/A',
        institution: body.organization || 'N/A'
      }),
      body.abstract || '',
      JSON.stringify(body.keywords || []),
      body.category || 'General'
    ])
    
    return NextResponse.json({
      success: true,
      abstract: { id: result.insertId, ...body }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating abstract:', error)
    return NextResponse.json(
      { error: 'Failed to create abstract' },
      { status: 500 }
    )
  }
}
