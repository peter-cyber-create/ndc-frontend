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

// GET /api/stores/auth - Get user permissions for stores module
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would get the user ID from the authentication token
    // For now, we'll use a mock user ID
    const userId = 1; // TODO: Get from auth context
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Get user's stores permissions
    const [userPermissions] = await connection.execute(
      `SELECT 
        su.role,
        su.department,
        su.can_approve_grn,
        su.can_approve_issuance,
        su.can_create_grn,
        su.can_create_issuance
      FROM stores_users su
      WHERE su.user_id = ?`,
      [userId]
    );

    await connection.end();

    if ((userPermissions as any[]).length === 0) {
      // Return default permissions if user not found
      return NextResponse.json({
        success: true,
        data: {
          role: 'viewer',
          department: null,
          permissions: {
            canViewGRN: true,
            canCreateGRN: false,
            canApproveGRN: false,
            canViewIssuance: true,
            canCreateIssuance: false,
            canApproveIssuance: false,
            canViewLedger: true,
            canManageItems: false
          }
        }
      });
    }

    const user = (userPermissions as any)[0];
    
    // Map database permissions to frontend permissions
    const permissions = {
      canViewGRN: true, // Everyone can view GRNs
      canCreateGRN: user.can_create_grn || user.role === 'admin',
      canApproveGRN: user.can_approve_grn || user.role === 'admin',
      canViewIssuance: true, // Everyone can view issuances
      canCreateIssuance: user.can_create_issuance || user.role === 'admin',
      canApproveIssuance: user.can_approve_issuance || user.role === 'admin',
      canViewLedger: true, // Everyone can view ledger
      canManageItems: user.role === 'admin' || user.role === 'store_keeper'
    };

    return NextResponse.json({
      success: true,
      data: {
        role: user.role,
        department: user.department,
        permissions
      }
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user permissions' },
      { status: 500 }
    );
  }
}

// POST /api/stores/auth - Update user permissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      role,
      department,
      can_approve_grn,
      can_approve_issuance,
      can_create_grn,
      can_create_issuance
    } = body;

    if (!user_id || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Check if user already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM stores_users WHERE user_id = ?',
      [user_id]
    );

    if ((existingUser as any[]).length > 0) {
      // Update existing user
      await connection.execute(
        `UPDATE stores_users SET 
          role = ?, department = ?, can_approve_grn = ?, 
          can_approve_issuance = ?, can_create_grn = ?, 
          can_create_issuance = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [role, department, can_approve_grn, can_approve_issuance, can_create_grn, can_create_issuance, user_id]
      );
    } else {
      // Insert new user
      await connection.execute(
        `INSERT INTO stores_users (
          user_id, role, department, can_approve_grn, 
          can_approve_issuance, can_create_grn, can_create_issuance
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, role, department, can_approve_grn, can_approve_issuance, can_create_grn, can_create_issuance]
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'User permissions updated successfully'
    });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user permissions' },
      { status: 500 }
    );
  }
}
