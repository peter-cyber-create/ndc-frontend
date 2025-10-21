import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'conf',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// POST /api/stores/grn/[id]/upload - Upload GRN attachments
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grnId = parseInt(params.id);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'form5' or 'technical_specs'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!fileType || !['form5', 'technical_specs'].includes(fileType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Must be form5 or technical_specs' },
        { status: 400 }
      );
    }

    // Check if GRN exists
    const connection = await mysql.createConnection(dbConfig);
    const [grnRows] = await connection.execute(
      'SELECT id FROM grn WHERE id = ?',
      [grnId]
    );

    if ((grnRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'GRN not found' },
        { status: 404 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'grn');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${grnId}_${fileType}_${Date.now()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);
    const fileUrl = `/uploads/grn/${fileName}`;

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update GRN with file URL
    const updateField = fileType === 'form5' ? 'form5_url' : 'technical_specs_url';
    await connection.execute(
      `UPDATE grn SET ${updateField} = ? WHERE id = ?`,
      [fileUrl, grnId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { fileUrl, fileName },
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
