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
    const abstractId = params.id
    
    // Get abstract file path from database
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute(
      'SELECT file_url, primary_author, title FROM abstracts WHERE id = ?',
      [abstractId]
    )
    await connection.end()
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Abstract not found" },
        { status: 404 }
      )
    }
    
    const abstract = rows[0] as any
    const filePath = abstract.file_url
    
    if (!filePath) {
      return NextResponse.json(
        { error: "No file uploaded for this abstract" },
        { status: 404 }
      )
    }

    // Construct the full file path
    const fullPath = join(process.cwd(), filePath)
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      )
    }

    // Read the file
    const fileBuffer = await readFile(fullPath)
    
    // Get file extension to determine content type
    const extension = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'doc':
        contentType = 'application/msword'
        break
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'txt':
        contentType = 'text/plain'
        break
    }

    // Create filename with author name and title
    let authorName = 'Unknown_Author'
    try {
      // Try to parse primary_author as JSON first
      const authorData = JSON.parse(abstract.primary_author)
      if (authorData.firstName && authorData.lastName) {
        authorName = `${authorData.firstName}_${authorData.lastName}`
      }
    } catch {
      // If not JSON, use as string
      authorName = abstract.primary_author.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    }
    
    const title = abstract.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50)
    const filename = `Abstract_${authorName}_${title}.${extension}`

    // Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error("Error downloading abstract file:", error)
    return NextResponse.json(
      { error: "Failed to download abstract file" },
      { status: 500 }
    )
  }
}
