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

// GET /api/stores/grn/[id] - Get specific GRN with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const grnId = parseInt(params.id);

    // Get GRN details
    const [grnRows] = await connection.execute(
      `SELECT * FROM grn WHERE id = ?`,
      [grnId]
    );

    if ((grnRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'GRN not found' },
        { status: 404 }
      );
    }

    // Get GRN items with item details
    const [itemRows] = await connection.execute(
      `SELECT 
        gi.*,
        i.item_code,
        i.description,
        i.unit_of_issue
      FROM grn_items gi
      JOIN items i ON gi.item_id = i.id
      WHERE gi.grn_id = ?
      ORDER BY gi.id`,
      [grnId]
    );

    await connection.end();

    const grn = (grnRows as any)[0];
    grn.items = itemRows;

    return NextResponse.json({
      success: true,
      data: grn
    });
  } catch (error) {
    console.error('Error fetching GRN:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GRN' },
      { status: 500 }
    );
  }
}

// PATCH /api/stores/grn/[id] - Update GRN (approval, signatures, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const grnId = parseInt(params.id);
    const {
      approval_status,
      receiving_officer_signature,
      issuing_officer_signature,
      approving_officer_signature,
      form5_url,
      technical_specs_url,
      remarks,
      items
    } = body;

    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Update GRN
      const updateFields = [];
      const updateValues = [];

      if (approval_status) {
        updateFields.push('approval_status = ?');
        updateValues.push(approval_status);
      }
      if (receiving_officer_signature) {
        updateFields.push('receiving_officer_signature = ?');
        updateValues.push(receiving_officer_signature);
      }
      if (issuing_officer_signature) {
        updateFields.push('issuing_officer_signature = ?');
        updateValues.push(issuing_officer_signature);
      }
      if (approving_officer_signature) {
        updateFields.push('approving_officer_signature = ?');
        updateValues.push(approving_officer_signature);
      }
      if (form5_url) {
        updateFields.push('form5_url = ?');
        updateValues.push(form5_url);
      }
      if (technical_specs_url) {
        updateFields.push('technical_specs_url = ?');
        updateValues.push(technical_specs_url);
      }
      if (remarks) {
        updateFields.push('remarks = ?');
        updateValues.push(remarks);
      }

      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(grnId);

        await connection.execute(
          `UPDATE grn SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }

      // Update items if provided
      if (items && items.length > 0) {
        // Delete existing items
        await connection.execute(
          'DELETE FROM grn_items WHERE grn_id = ?',
          [grnId]
        );

        // Insert updated items
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
      }

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'GRN updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating GRN:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update GRN' },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/grn/[id] - Delete GRN
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const grnId = parseInt(params.id);

    // Check if GRN exists and is not approved
    const [grnRows] = await connection.execute(
      'SELECT approval_status FROM grn WHERE id = ?',
      [grnId]
    );

    if ((grnRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'GRN not found' },
        { status: 404 }
      );
    }

    const grn = (grnRows as any)[0];
    if (grn.approval_status === 'approved') {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Cannot delete approved GRN' },
        { status: 400 }
      );
    }

    // Delete GRN (items will be deleted by CASCADE)
    await connection.execute('DELETE FROM grn WHERE id = ?', [grnId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'GRN deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting GRN:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete GRN' },
      { status: 500 }
    );
  }
}
