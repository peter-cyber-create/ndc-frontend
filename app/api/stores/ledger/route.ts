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

// GET /api/stores/ledger - Get ledger summary for all items
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        i.id,
        i.item_code,
        i.description,
        i.unit_of_issue,
        i.category,
        i.subcategory,
        i.minimum_stock_level,
        i.maximum_stock_level,
        i.current_stock,
        i.unit_cost,
        i.supplier,
        CASE 
          WHEN i.current_stock <= i.minimum_stock_level THEN 'low'
          WHEN i.current_stock >= i.maximum_stock_level THEN 'high'
          ELSE 'normal'
        END as stock_status,
        (i.current_stock * i.unit_cost) as total_value
      FROM items i
      WHERE 1=1
    `;
    
    const params = [];

    if (category) {
      query += ' AND i.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (i.item_code LIKE ? OR i.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (lowStock) {
      query += ' AND i.current_stock <= i.minimum_stock_level';
    }

    query += ' ORDER BY i.item_code LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [items] = await connection.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM items i WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND i.category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (i.item_code LIKE ? OR i.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (lowStock) {
      countQuery += ' AND i.current_stock <= i.minimum_stock_level';
    }

    const [countResult] = await connection.execute(countQuery, countParams);
    const total = (countResult as any)[0].total;

    // Get categories for filter
    const [categories] = await connection.execute(
      'SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category'
    );

    // Get stock summary statistics
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN current_stock <= minimum_stock_level THEN 1 ELSE 0 END) as low_stock_items,
        SUM(CASE WHEN current_stock >= maximum_stock_level THEN 1 ELSE 0 END) as high_stock_items,
        SUM(current_stock * unit_cost) as total_inventory_value
      FROM items
    `);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: items,
      categories: categories,
      statistics: (stats as any)[0],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ledger summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ledger summary' },
      { status: 500 }
    );
  }
}
