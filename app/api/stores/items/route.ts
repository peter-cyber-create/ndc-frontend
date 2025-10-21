import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'conf',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// GET /api/stores/items - Get all items
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (item_code LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY item_code LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [items] = await connection.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM items WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (item_code LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await connection.execute(countQuery, countParams);
    const total = (countResult as any)[0].total;

    // Get categories for filter
    const [categories] = await connection.execute(
      'SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category'
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: items,
      categories: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/stores/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      item_code,
      description,
      unit_of_issue,
      category,
      subcategory,
      minimum_stock_level,
      maximum_stock_level,
      unit_cost,
      supplier
    } = body;

    if (!item_code || !description || !unit_of_issue) {
      return NextResponse.json(
        { success: false, error: 'Item code, description, and unit of issue are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Check if item code already exists
    const [existingItems] = await connection.execute(
      'SELECT id FROM items WHERE item_code = ?',
      [item_code]
    );

    if ((existingItems as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Item code already exists' },
        { status: 400 }
      );
    }

    // Insert new item
    const [result] = await connection.execute(
      `INSERT INTO items (
        item_code, description, unit_of_issue, category, subcategory,
        minimum_stock_level, maximum_stock_level, unit_cost, supplier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item_code, description, unit_of_issue, category, subcategory,
        minimum_stock_level || 0, maximum_stock_level || 0, unit_cost || 0, supplier
      ]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
