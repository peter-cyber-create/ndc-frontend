import { NextRequest, NextResponse } from "next/server"
import mysql, { Pool } from 'mysql2/promise'

// Create a pooled connection for better performance under load
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Cache presence of optional columns to avoid information_schema on every request
let hasCrossCuttingThemesColumn: boolean | undefined
async function ensureColumnPresenceCached(): Promise<void> {
  if (typeof hasCrossCuttingThemesColumn !== 'undefined') return
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM information_schema.columns WHERE table_name = 'abstracts' AND column_name = 'cross_cutting_themes'`
    ) as any
    hasCrossCuttingThemesColumn = rows[0]?.count > 0
  } catch {
    hasCrossCuttingThemesColumn = false
  }
}

export async function GET(request: NextRequest) {
  try {
    // Pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSizeRaw = parseInt(searchParams.get('pageSize') || '20', 10)
    const pageSize = Math.min(Math.max(1, pageSizeRaw), 100)
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'created_at'
    const order = (searchParams.get('order') || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    await ensureColumnPresenceCached()

    const offset = (page - 1) * pageSize

    // Columns: omit large text fields for listing view to reduce payload
    const baseColumns = [
      'id', 'title', 'presentation_type', 'category', 'subcategory',
      'primary_author', 'co_authors', 'abstract_summary', 'keywords',
      // include corresponding email and organization so admin can contact submitters
      'corresponding_email', 'organization',
      'status', 'reviewed_by', 'reviewed_at', 'created_at', 'updated_at'
    ]

    const selectColumns = hasCrossCuttingThemesColumn
      ? baseColumns.concat(['cross_cutting_themes']).join(', ')
      : baseColumns.join(', ')

    // Basic whitelist for sorting
    const sortable = new Set(['created_at', 'updated_at', 'title', 'status'])
    const sortColumn = sortable.has(sort) ? sort : 'created_at'

    const whereClauses: string[] = []
    const params: any[] = []
    if (status) {
      whereClauses.push('status = ?')
      params.push(status)
    }
    if (category) {
      whereClauses.push('category = ?')
      params.push(category)
    }
    if (search) {
      whereClauses.push('(title LIKE ? OR primary_author LIKE ? OR organization LIKE ?)')
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    // Total count (for pagination UI)
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM abstracts ${whereSql}`,
      params
    ) as any
    const total = countRows[0]?.total ?? 0

    // Paged query
    const [rows] = await pool.execute(
      `SELECT ${selectColumns} FROM abstracts ${whereSql} ORDER BY ${sortColumn} ${order} LIMIT ${pageSize} OFFSET ${offset}`,
      params
    )

    const response = NextResponse.json({
      success: true,
      data: rows,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    })

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching abstracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abstracts' },
      { status: 500, headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } }
    )
  }
}
