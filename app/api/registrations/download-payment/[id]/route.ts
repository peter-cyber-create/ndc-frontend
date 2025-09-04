import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/mysql'
import path from 'path'
import { promises as fs } from 'fs'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = DatabaseManager.getInstance()
    
    const registration = await db.executeOne(`
      SELECT id, first_name, last_name, email, payment_reference, payment_proof_url
      FROM registrations 
      WHERE id = ?
    `, [id]) as any

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
      const filename = `PaymentProof_${cleanFirstName}_${cleanLastName}_${(registration as any).id}${fileExtension}`

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
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
