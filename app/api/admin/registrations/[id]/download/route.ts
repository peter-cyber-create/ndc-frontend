import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Download request for registration ID:', params.id)
    const registrationId = params.id
    
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await (connection as any).execute(
      'SELECT paymentProofUrl, firstName, lastName FROM registrations WHERE id = ?',
      [registrationId]
    )
    await connection.end()
    
    if (!Array.isArray(rows) || rows.length === 0) {
      console.log('Registration not found for ID:', registrationId)
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }
    
    const registration = rows[0] as any
    const filePath = registration.paymentProofUrl
    console.log('File path from DB:', filePath)
    
    if (!filePath) {
      console.log('No payment proof URL for registration:', registrationId)
      return NextResponse.json({ error: "No payment proof uploaded" }, { status: 404 })
    }

    // Remove leading slash if present and construct full path
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath
    const fullPath = join(process.cwd(), 'public', cleanPath)
    console.log('Full file path:', fullPath)
    
    if (!existsSync(fullPath)) {
      console.log('File does not exist at path:', fullPath)
      return NextResponse.json({ error: "Payment proof file not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(fullPath)
    const extension = filePath.split('.').pop()?.toLowerCase()
    
    let contentType = 'application/octet-stream'
    if (extension === 'pdf') contentType = 'application/pdf'
    else if (extension === 'jpg' || extension === 'jpeg') contentType = 'image/jpeg'
    else if (extension === 'png') contentType = 'image/png'

    const filename = `Payment_Proof_${registration.firstName}_${registration.lastName}.${extension}`
    console.log('Serving file:', filename)

    return new NextResponse(fileBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error("Error downloading payment proof:", error)
    return NextResponse.json({ error: "Failed to download payment proof" }, { status: 500 })
  }
}
