import mysql from 'mysql2/promise';

class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'conf',
      password: process.env.DB_PASSWORD || 'toor',
      database: process.env.DB_NAME || 'conf',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async execute(query: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async query(query: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async executeOne<T>(query: string, params?: any[]): Promise<T | null> {
    try {
      const [rows] = await this.pool.execute(query, params);
      const result = rows as T[];
      return result[0] || null;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export { DatabaseManager };