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

// GET /api/stores/ledger/[itemId] - Get detailed ledger for specific item
export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const itemId = parseInt(params.itemId);

    // Get item details
    const [itemRows] = await connection.execute(
      `SELECT * FROM items WHERE id = ?`,
      [itemId]
    );

    if ((itemRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Get ledger entries for the item
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        le.*,
        g.grn_number,
        i.serial_number as issuance_serial
      FROM ledger_entries le
      LEFT JOIN grn g ON le.grn_id = g.id
      LEFT JOIN issuance i ON le.issuance_id = i.id
      WHERE le.item_id = ?
    `;
    
    const params = [itemId];

    if (startDate) {
      query += ' AND le.transaction_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND le.transaction_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY le.transaction_date DESC, le.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [ledgerEntries] = await connection.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM ledger_entries WHERE item_id = ?';
    const countParams = [itemId];
    
    if (startDate) {
      countQuery += ' AND transaction_date >= ?';
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ' AND transaction_date <= ?';
      countParams.push(endDate);
    }

    const [countResult] = await connection.execute(countQuery, countParams);
    const total = (countResult as any)[0].total;

    // Get opening balance (first entry or 0)
    const [openingBalance] = await connection.execute(
      `SELECT opening_stock FROM ledger_entries 
       WHERE item_id = ? 
       ORDER BY transaction_date ASC, created_at ASC 
       LIMIT 1`,
      [itemId]
    );

    const openingStock = (openingBalance as any[]).length > 0 
      ? (openingBalance as any)[0].opening_stock 
      : 0;

    await connection.end();

    const item = (itemRows as any)[0];

    return NextResponse.json({
      success: true,
      data: {
        item,
        ledgerEntries,
        openingStock,
        currentStock: item.current_stock,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching item ledger:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item ledger' },
      { status: 500 }
    );
  }
}

// POST /api/stores/ledger/[itemId]/recalculate - Force recalculation of ledger
export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const itemId = parseInt(params.itemId);

    // Check if item exists
    const [itemRows] = await connection.execute(
      `SELECT id FROM items WHERE id = ?`,
      [itemId]
    );

    if ((itemRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    await connection.beginTransaction();

    try {
      // Delete existing ledger entries for this item
      await connection.execute(
        'DELETE FROM ledger_entries WHERE item_id = ?',
        [itemId]
      );

      // Get all GRN items for this item
      const [grnItems] = await connection.execute(
        `SELECT 
          gi.grn_id, gi.quantity_delivered, g.approval_status, g.created_at
         FROM grn_items gi
         JOIN grn g ON gi.grn_id = g.id
         WHERE gi.item_id = ? AND g.approval_status = 'approved'
         ORDER BY g.created_at ASC`,
        [itemId]
      );

      // Get all issuance items for this item
      const [issuanceItems] = await connection.execute(
        `SELECT 
          ii.issuance_id, ii.quantity_issued, i.approval_status, i.created_at
         FROM issuance_items ii
         JOIN issuance i ON ii.issuance_id = i.id
         WHERE ii.item_id = ? AND i.approval_status = 'issued'
         ORDER BY i.created_at ASC`,
        [itemId]
      );

      // Calculate running balance
      let runningBalance = 0;
      const allTransactions = [];

      // Add GRN transactions
      for (const grnItem of grnItems as any[]) {
        allTransactions.push({
          type: 'received',
          date: grnItem.created_at,
          grn_id: grnItem.grn_id,
          quantity: grnItem.quantity_delivered,
          balance: runningBalance + grnItem.quantity_delivered
        });
        runningBalance += grnItem.quantity_delivered;
      }

      // Add issuance transactions
      for (const issuanceItem of issuanceItems as any[]) {
        allTransactions.push({
          type: 'issued',
          date: issuanceItem.created_at,
          issuance_id: issuanceItem.issuance_id,
          quantity: issuanceItem.quantity_issued,
          balance: runningBalance - issuanceItem.quantity_issued
        });
        runningBalance -= issuanceItem.quantity_issued;
      }

      // Sort by date
      allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Insert ledger entries
      let previousBalance = 0;
      for (const transaction of allTransactions) {
        const openingStock = previousBalance;
        const received = transaction.type === 'received' ? transaction.quantity : 0;
        const issued = transaction.type === 'issued' ? transaction.quantity : 0;
        const closingBalance = transaction.balance;

        await connection.execute(
          `INSERT INTO ledger_entries (
            item_id, transaction_date, grn_id, issuance_id,
            opening_stock, received_quantity, issued_quantity,
            closing_balance, transaction_type, remarks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemId, transaction.date, transaction.grn_id || null, transaction.issuance_id || null,
            openingStock, received, issued, closingBalance, transaction.type,
            `${transaction.type === 'received' ? 'GRN' : 'Issuance'} transaction`
          ]
        );

        previousBalance = closingBalance;
      }

      // Update current stock in items table
      await connection.execute(
        'UPDATE items SET current_stock = ? WHERE id = ?',
        [runningBalance, itemId]
      );

      await connection.commit();
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Ledger recalculated successfully',
        data: {
          currentStock: runningBalance,
          transactionsProcessed: allTransactions.length
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error recalculating ledger:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to recalculate ledger' },
      { status: 500 }
    );
  }
}
