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
    const abstract = await db.executeOne(`
      SELECT id, title, primary_author, file_url
      FROM abstracts 
      WHERE id = ?
    `, [id]) as AbstractRecord

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
        authorName = `${primaryAuthor.firstName || ''} ${primaryAuthor.lastName || ''}`.trim() || 'Unknown'
      } catch (e) {
        // Use fallback
      }
      
      const cleanAuthorName = authorName.replace(/[^a-zA-Z0-9]/g, '_')
      const cleanTitle = abstract.title.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `Abstract_${cleanAuthorName}_${cleanTitle}${fileExtension}`

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
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
