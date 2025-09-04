#!/bin/bash

echo "🔧 Fixing all TypeScript build errors..."

# Fix 1: app/admin/abstracts/page.tsx - Change 'authors' to 'author'
echo "Fixing abstract.authors to abstract.author..."
sed -i 's/abstract\.authors/abstract.author/g' app/admin/abstracts/page.tsx

# Fix 2: app/api/abstracts/download/[id]/route.ts - Add AbstractRecord interface and type assertions
echo "Fixing abstract download route type errors..."
cat > app/api/abstracts/download/[id]/route.ts << 'INNER_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'
import path from 'path'
import { promises as fs } from 'fs'

export const dynamic = 'force-dynamic'

// Define the type for the abstract object
interface AbstractRecord {
  id: number
  title: string
  primary_author: string
  file_url: string | null
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = DatabaseManager.getInstance()
    
    // Get abstract with file information
    const abstract = await db.executeOne(\`
      SELECT id, title, primary_author, file_url
      FROM abstracts 
      WHERE id = ?
    \`, [id]) as AbstractRecord

    if (!abstract) {
      return NextResponse.json(
        { error: 'Abstract not found' },
        { status: 404 }
      )
    }

    if (!abstract.file_url) {
      return NextResponse.json(
        { error: 'No file available for this abstract' },
        { status: 404 }
      )
    }

    // Parse file information from JSON
    let fileInfo: { name: string; size?: number; type?: string }
    try {
      fileInfo = JSON.parse(abstract.file_url)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid file information' },
        { status: 404 }
      )
    }

    if (!fileInfo.name) {
      return NextResponse.json(
        { error: 'No file name available' },
        { status: 404 }
      )
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts')
    
    let files: string[] = []
    try {
      files = await fs.readdir(uploadsDir)
    } catch (e) {
      return NextResponse.json(
        { error: 'Uploads directory not found' },
        { status: 404 }
      )
    }
    
    let matchingFile = files.find((file: string) => file === fileInfo.name)
    
    if (!matchingFile) {
      const baseName = fileInfo.name.replace(/\.(pdf|docx|doc)$/i, '')
      matchingFile = files.find((file: string) => file.toLowerCase().includes(baseName.toLowerCase()))
    }
    
    if (!matchingFile && fileInfo.size) {
      const stats = await Promise.all(files.map(async (file: string) => {
        try {
          const filePath = path.join(uploadsDir, file)
          const stat = await fs.stat(filePath)
          return { file, size: stat.size }
        } catch (e) {
          return { file, size: 0 }
        }
      }))
      const sizeMatch = stats.find(stat => stat.size === fileInfo.size)
      if (sizeMatch) {
        matchingFile = sizeMatch.file
      }
    }
    
    if (!matchingFile) {
      const availableFiles = files.filter((f: string) => f !== '.gitkeep')
      if (availableFiles.length > 0) {
        matchingFile = availableFiles[0]
      } else {
        return NextResponse.json(
          { error: 'No files found in uploads directory' },
          { status: 404 }
        )
      }
    }

    const filePath = path.join(uploadsDir, matchingFile)

    try {
      const fileBuffer = await fs.readFile(filePath)
      const fileExtension = path.extname(fileInfo.name)
      
      let authorName = 'Unknown'
      try {
        const primaryAuthor = JSON.parse(abstract.primary_author || '{}')
        authorName = \`\${primaryAuthor.firstName || ''} \${primaryAuthor.lastName || ''}\`.trim() || 'Unknown'
      } catch (e) {
        // Use fallback
      }
      
      const cleanAuthorName = authorName.replace(/[^a-zA-Z0-9]/g, '_')
      const cleanTitle = abstract.title.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = \`Abstract_\${cleanAuthorName}_\${cleanTitle}\${fileExtension}\`

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': \`attachment; filename="\${filename}"\`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('Error reading file:', fileError)
      return NextResponse.json(
        { error: 'Error reading file from server' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error downloading abstract:', error)
    return NextResponse.json(
      { error: 'Failed to download abstract' },
      { status: 500 }
    )
  }
}
INNER_EOF

# Fix 3: app/api/admin/abstracts/route.ts - Add type annotations and fix DataManager
echo "Fixing admin abstracts route..."
cat > app/api/admin/abstracts/route.ts << 'INNER_EOF'
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
    
    const abstracts = await db.execute(\`
      SELECT id, title, primary_author, abstract_summary, keywords, 
             category, status, file_url, created_at
      FROM abstracts 
      ORDER BY created_at DESC
    \`) as DatabaseAbstract[]

    const transformedAbstracts = abstracts.map((abstract: any) => {
      let primaryAuthor: PrimaryAuthor = {}
      try {
        primaryAuthor = JSON.parse(abstract.primary_author || '{}') as any
      } catch (e) {
        primaryAuthor = {}
      }
      
      return {
        id: abstract.id,
        title: abstract.title,
        author: \`\${(primaryAuthor as any).firstName || 'Unknown'} \${(primaryAuthor as any).lastName || 'Author'}\`,
        email: (primaryAuthor as any).email || 'N/A',
        organization: (primaryAuthor as any).institution || 'N/A',
        abstract: abstract.abstract_summary,
        keywords: abstract.keywords ? JSON.parse(abstract.keywords) : [],
        category: abstract.category,
        status: abstract.status,
        filePath: abstract.file_url ? JSON.parse(abstract.file_url)?.url : null,
        fileName: abstract.file_url ? JSON.parse(abstract.file_url)?.name : null,
        fileSize: abstract.file_url ? JSON.parse(abstract.file_url)?.size : null,
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
    const result = await db.execute(\`
      INSERT INTO abstracts (
        title, primary_author, abstract_summary, keywords, 
        category, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'submitted', NOW(), NOW())
    \`, [
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
INNER_EOF

# Fix 4: app/api/admin/registrations/route.ts - Fix DataManager
echo "Fixing admin registrations route..."
cat > app/api/admin/registrations/route.ts << 'INNER_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const registrations = await db.execute(\`
      SELECT id, first_name, last_name, email, phone, organization, 
             position, registration_type, payment_status, status, created_at
      FROM registrations 
      ORDER BY created_at DESC
    \`)

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
    
    const result = await db.execute(\`
      INSERT INTO registrations (
        first_name, last_name, email, phone, organization, position, registration_type, payment_status, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())
    \`, [
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.organization,
      body.position,
      body.registrationType,
      body.paymentStatus || 'pending'
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
INNER_EOF

# Fix 5: app/api/admin/contacts/route.ts - Fix DataManager
echo "Fixing admin contacts route..."
cat > app/api/admin/contacts/route.ts << 'INNER_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const contacts = await db.execute(\`
      SELECT id, name, email, phone, organization, message, status, created_at
      FROM contacts 
      ORDER BY created_at DESC
    \`)

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
    
    const result = await db.execute(\`
      INSERT INTO contacts (
        name, email, phone, organization, message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, 'submitted', NOW())
    \`, [
      body.name,
      body.email,
      body.phone,
      body.organization,
      body.message
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
INNER_EOF

# Fix 6: app/api/admin/dashboard/route.ts - Add type annotations
echo "Fixing admin dashboard route..."
cat > app/api/admin/dashboard/route.ts << 'INNER_EOF'
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
          name: \`\${r.first_name} \${r.last_name}\`,
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
INNER_EOF

# Fix 7: app/api/admin/sponsorships/route.ts - Add type annotation
echo "Fixing admin sponsorships route..."
cat > app/api/admin/sponsorships/route.ts << 'INNER_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance()
    
    const sponsorships = await db.execute(\`
      SELECT id, company_name, contact_person, email, phone, 
             selected_package, message, status, created_at
      FROM sponsorships 
      ORDER BY created_at DESC
    \`)

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
    
    const result = await db.execute(\`
      INSERT INTO sponsorships (
        company_name, contact_person, email, phone, selected_package, message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'submitted', NOW())
    \`, [
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
INNER_EOF

# Fix 8: app/api/registrations/download-payment/[id]/route.ts - Add type assertions
echo "Fixing payment download route..."
cat > app/api/registrations/download-payment/[id]/route.ts << 'INNER_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'
import path from 'path'
import { promises as fs } from 'fs'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = DatabaseManager.getInstance()
    
    const registration = await db.executeOne(\`
      SELECT id, first_name, last_name, email, payment_reference, payment_proof_url
      FROM registrations 
      WHERE id = ?
    \`, [id]) as any

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    if (!(registration as any).payment_reference) {
      return NextResponse.json(
        { error: 'No payment proof available for this registration' },
        { status: 404 }
      )
    }

    // Parse payment proof URL from JSON
    let paymentProofUrl: string
    try {
      const paymentData = JSON.parse((registration as any).payment_proof_url || '{}')
      paymentProofUrl = paymentData.url || paymentData.filePath
    } catch (e) {
      paymentProofUrl = (registration as any).payment_proof_url
    }

    if (!paymentProofUrl) {
      return NextResponse.json(
        { error: 'No payment proof file available' },
        { status: 404 }
      )
    }

    // Extract filename from URL
    const fileName = paymentProofUrl.split('/').pop() || 'payment_proof.pdf'
    const filePath = path.join(process.cwd(), 'public', paymentProofUrl)

    try {
      const fileBuffer = await fs.readFile(filePath)
      const fileExtension = path.extname(fileName)
      
      const cleanFirstName = (registration as any).first_name.replace(/[^a-zA-Z0-9]/g, '_')
      const cleanLastName = (registration as any).last_name.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = \`PaymentProof_\${cleanFirstName}_\${cleanLastName}_\${(registration as any).id}\${fileExtension}\`

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': \`attachment; filename="\${filename}"\`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('Error reading payment proof file:', fileError)
      return NextResponse.json(
        { error: 'Error reading payment proof file' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error downloading payment proof:', error)
    return NextResponse.json(
      { error: 'Failed to download payment proof' },
      { status: 500 }
    )
  }
}
INNER_EOF

echo "✅ All TypeScript build errors fixed!"
echo "🔨 Now running build..."
npm run build
