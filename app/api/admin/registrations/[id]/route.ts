import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'conf',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const registrationId = params.id
    
    // Get registration details including file paths before deletion
    const [existing] = await (connection as any).execute(
      'SELECT id, paymentProofUrl, passportPhotoUrl FROM registrations WHERE id = ?',
      [registrationId]
    )
    
    if (!Array.isArray(existing) || existing.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    const registration = existing[0]
    
    // Delete associated files
    const filesToDelete = []
    
    if (registration.paymentProofUrl) {
      filesToDelete.push(registration.paymentProofUrl)
    }
    
    if (registration.passportPhotoUrl) {
      filesToDelete.push(registration.passportPhotoUrl)
    }
    
    // Delete files from filesystem
    for (const filePath of filesToDelete) {
      try {
        let fullPath: string
        
        if (filePath.startsWith('/uploads/')) {
          const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath
          fullPath = join(process.cwd(), cleanPath)
        } else if (filePath.startsWith('uploads/')) {
          fullPath = join(process.cwd(), filePath)
        } else {
          fullPath = join(process.cwd(), filePath)
        }
        
        if (existsSync(fullPath)) {
          await unlink(fullPath)
          console.log(`Deleted file: ${fullPath}`)
        }
      } catch (fileError) {
        console.error(`Error deleting file ${filePath}:`, fileError)
        // Continue with database deletion even if file deletion fails
      }
    }
    
    // Delete the registration from database
    await (connection as any).execute(
      'DELETE FROM registrations WHERE id = ?',
      [registrationId]
    )
    
    await connection.end()
    
    return NextResponse.json({
      success: true,
      message: 'Registration and associated files deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}
