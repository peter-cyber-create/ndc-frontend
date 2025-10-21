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

// GET /api/stores/issuance/[id] - Get specific issuance with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const issuanceId = parseInt(params.id);

    // Get issuance details
    const [issuanceRows] = await connection.execute(
      `SELECT * FROM issuance WHERE id = ?`,
      [issuanceId]
    );

    if ((issuanceRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Issuance not found' },
        { status: 404 }
      );
    }

    // Get issuance items with item details
    const [itemRows] = await connection.execute(
      `SELECT 
        ii.*,
        i.item_code,
        i.description,
        i.unit_of_issue,
        i.current_stock
      FROM issuance_items ii
      JOIN items i ON ii.item_id = i.id
      WHERE ii.issuance_id = ?
      ORDER BY ii.id`,
      [issuanceId]
    );

    await connection.end();

    const issuance = (issuanceRows as any)[0];
    issuance.items = itemRows;

    return NextResponse.json({
      success: true,
      data: issuance
    });
  } catch (error) {
    console.error('Error fetching issuance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issuance' },
      { status: 500 }
    );
  }
}

// PATCH /api/stores/issuance/[id] - Update issuance (approval, signatures, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const issuanceId = parseInt(params.id);
    const {
      approval_status,
      requisition_officer_signature,
      issuing_officer_signature,
      receiving_officer_signature,
      head_of_department_signature,
      approving_officer_signature,
      remarks,
      items
    } = body;

    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Update issuance
      const updateFields = [];
      const updateValues = [];

      if (approval_status) {
        updateFields.push('approval_status = ?');
        updateValues.push(approval_status);
      }
      if (requisition_officer_signature) {
        updateFields.push('requisition_officer_signature = ?');
        updateValues.push(requisition_officer_signature);
      }
      if (issuing_officer_signature) {
        updateFields.push('issuing_officer_signature = ?');
        updateValues.push(issuing_officer_signature);
      }
      if (receiving_officer_signature) {
        updateFields.push('receiving_officer_signature = ?');
        updateValues.push(receiving_officer_signature);
      }
      if (head_of_department_signature) {
        updateFields.push('head_of_department_signature = ?');
        updateValues.push(head_of_department_signature);
      }
      if (approving_officer_signature) {
        updateFields.push('approving_officer_signature = ?');
        updateValues.push(approving_officer_signature);
      }
      if (remarks) {
        updateFields.push('remarks = ?');
        updateValues.push(remarks);
      }

      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(issuanceId);

        await connection.execute(
          `UPDATE issuance SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }

      // Update items if provided
      if (items && items.length > 0) {
        // Delete existing items
        await connection.execute(
          'DELETE FROM issuance_items WHERE issuance_id = ?',
          [issuanceId]
        );

        // Insert updated items
        for (const item of items) {
          await connection.execute(
            `INSERT INTO issuance_items (
              issuance_id, item_id, quantity_ordered, quantity_approved,
              quantity_issued, remarks
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              issuanceId, item.item_id, item.quantity_ordered, 
              item.quantity_approved || 0, item.quantity_issued || 0, item.remarks
            ]
          );
        }
      }

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Issuance updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating issuance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update issuance' },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/issuance/[id] - Delete issuance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const issuanceId = parseInt(params.id);

    // Check if issuance exists and is not issued
    const [issuanceRows] = await connection.execute(
      'SELECT approval_status FROM issuance WHERE id = ?',
      [issuanceId]
    );

    if ((issuanceRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Issuance not found' },
        { status: 404 }
      );
    }

    const issuance = (issuanceRows as any)[0];
    if (issuance.approval_status === 'issued') {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Cannot delete issued requisition' },
        { status: 400 }
      );
    }

    // Delete issuance (items will be deleted by CASCADE)
    await connection.execute('DELETE FROM issuance WHERE id = ?', [issuanceId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Issuance deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting issuance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete issuance' },
      { status: 500 }
    );
  }
}
