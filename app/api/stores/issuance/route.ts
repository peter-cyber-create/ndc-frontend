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

// Generate unique serial number for issuance
function generateSerialNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ISS${year}${month}${random}`;
}

// GET /api/stores/issuance - Get all issuances
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        i.*,
        COUNT(ii.id) as item_count,
        SUM(ii.quantity_ordered) as total_quantity_ordered,
        SUM(ii.quantity_approved) as total_quantity_approved,
        SUM(ii.quantity_issued) as total_quantity_issued
      FROM issuance i
      LEFT JOIN issuance_items ii ON i.id = ii.issuance_id
    `;
    
    const conditions = [];
    if (status) {
      conditions.push(`i.approval_status = ?`);
    }
    if (department) {
      conditions.push(`i.from_department = ?`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY i.id ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;

    const params = [];
    if (status) params.push(status);
    if (department) params.push(department);
    params.push(limit, offset);

    const [issuances] = await connection.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM issuance';
    const countParams = [];
    
    if (status) {
      countQuery += ' WHERE approval_status = ?';
      countParams.push(status);
    }
    if (department) {
      countQuery += status ? ' AND from_department = ?' : ' WHERE from_department = ?';
      countParams.push(department);
    }

    const [countResult] = await connection.execute(countQuery, countParams);
    const total = (countResult as any)[0].total;

    await connection.end();

    return NextResponse.json({
      success: true,
      data: issuances,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching issuances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issuances' },
      { status: 500 }
    );
  }
}

// POST /api/stores/issuance - Create new issuance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      from_department,
      issuance_date,
      requisition_officer_name,
      issuing_officer_name,
      receiving_officer_name,
      head_of_department_name,
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

    if (!from_department || !issuance_date) {
      return NextResponse.json(
        { success: false, error: 'Department and issuance date are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Generate unique serial number
      const serial_number = generateSerialNumber();

      // Insert issuance
      const [issuanceResult] = await connection.execute(
        `INSERT INTO issuance (
          serial_number, from_department, issuance_date,
          requisition_officer_name, issuing_officer_name, receiving_officer_name,
          head_of_department_name, approving_officer_name, remarks, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          serial_number, from_department, issuance_date,
          requisition_officer_name, issuing_officer_name, receiving_officer_name,
          head_of_department_name, approving_officer_name, remarks, 1 // TODO: Get from auth context
        ]
      );

      const issuanceId = (issuanceResult as any).insertId;

      // Insert issuance items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO issuance_items (
            issuance_id, item_id, quantity_ordered, quantity_approved, quantity_issued, remarks
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            issuanceId, item.item_id, item.quantity_ordered, 
            item.quantity_approved || 0, item.quantity_issued || 0, item.remarks
          ]
        );
      }

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        data: { id: issuanceId, serial_number },
        message: 'Issuance created successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating issuance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create issuance' },
      { status: 500 }
    );
  }
}
