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

// Generate unique GRN number
function generateGRNNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GRN${year}${month}${random}`;
}

// GET /api/stores/grn - Get all GRNs
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        g.*,
        COUNT(gi.id) as item_count,
        SUM(gi.quantity_delivered * gi.unit_cost) as total_value
      FROM grn g
      LEFT JOIN grn_items gi ON g.id = gi.grn_id
    `;
    
    const conditions = [];
    if (status) {
      conditions.push(`g.approval_status = ?`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY g.id ORDER BY g.created_at DESC LIMIT ? OFFSET ?`;

    const params = status ? [status, limit, offset] : [limit, offset];
    const [grns] = await connection.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM grn';
    if (status) {
      countQuery += ' WHERE approval_status = ?';
    }
    const [countResult] = await connection.execute(countQuery, status ? [status] : []);
    const total = (countResult as any)[0].total;

    await connection.end();

    return NextResponse.json({
      success: true,
      data: grns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GRNs' },
      { status: 500 }
    );
  }
}

// POST /api/stores/grn - Create new GRN
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      procurement_reference,
      lpo_number,
      delivery_note_number,
      tax_invoice_number,
      receiving_officer_name,
      issuing_officer_name,
      approving_officer_name,
      remarks,
      items
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Generate unique GRN number
      const grn_number = generateGRNNumber();

      // Insert GRN
      const [grnResult] = await connection.execute(
        `INSERT INTO grn (
          grn_number, procurement_reference, lpo_number, delivery_note_number,
          tax_invoice_number, receiving_officer_name, issuing_officer_name,
          approving_officer_name, remarks, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          grn_number, procurement_reference, lpo_number, delivery_note_number,
          tax_invoice_number, receiving_officer_name, issuing_officer_name,
          approving_officer_name, remarks, 1 // TODO: Get from auth context
        ]
      );

      const grnId = (grnResult as any).insertId;

      // Insert GRN items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO grn_items (
            grn_id, item_id, quantity_ordered, quantity_delivered,
            unit_cost, remarks
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            grnId, item.item_id, item.quantity_ordered, item.quantity_delivered,
            item.unit_cost || 0, item.remarks
          ]
        );
      }

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        data: { id: grnId, grn_number },
        message: 'GRN created successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating GRN:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create GRN' },
      { status: 500 }
    );
  }
}
