import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(__dirname, '../../data/td-buddy.db');
    // データディレクトリが存在しない場合は作成
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  async connect(): Promise<void> {
    if (!this.db) {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      console.log('✅ SQLite Database connected:', this.dbPath);
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('📡 Database disconnected');
    }
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) await this.connect();
    try {
      const result = this.db!.prepare(sql).run(...params);
      return result;
    } catch (error) {
      console.error('❌ Database run error:', error);
      throw error;
    }
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) await this.connect();
    try {
      const results = this.db!.prepare(sql).all(...params);
      return results;
    } catch (error) {
      console.error('❌ Database query error:', error);
      throw error;
    }
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) await this.connect();
    try {
      const result = this.db!.prepare(sql).get(...params);
      return result;
    } catch (error) {
      console.error('❌ Database get error:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (!this.db) await this.connect();
    
    const tables = [
      `CREATE TABLE IF NOT EXISTS generated_passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password_hash TEXT NOT NULL,
        criteria TEXT NOT NULL,
        strength TEXT NOT NULL,
        estimated_crack_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        user_session_id TEXT,
        ip_address TEXT,
        user_agent TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS generated_personal_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_hash TEXT NOT NULL,
        criteria TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        user_session_id TEXT,
        ip_address TEXT,
        user_agent TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS claude_generations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_hash TEXT NOT NULL,
        data_type TEXT NOT NULL,
        result_hash TEXT NOT NULL,
        token_usage INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        user_session_id TEXT,
        ip_address TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS api_statistics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        status_code INTEGER,
        response_time INTEGER,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS error_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        error_code TEXT,
        error_message TEXT,
        stack_trace TEXT,
        endpoint TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS generated_uuids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid_value TEXT NOT NULL,
        version TEXT NOT NULL,
        format TEXT NOT NULL,
        criteria TEXT NOT NULL,
        metadata TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        user_session_id TEXT,
        ip_address TEXT,
        user_agent TEXT
      )`
    ];

    for (const createTable of tables) {
      await this.run(createTable);
    }
    
    console.log('✅ Database tables initialized');
  }

  async cleanupExpiredData(): Promise<void> {
    const now = new Date().toISOString();
    const deletedPasswords = await this.run(
      'DELETE FROM generated_passwords WHERE expires_at < ?',
      [now]
    );
    const deletedPersonalInfo = await this.run(
      'DELETE FROM generated_personal_info WHERE expires_at < ?',
      [now]
    );
    const deletedUuids = await this.run(
      'DELETE FROM generated_uuids WHERE expires_at < ?',
      [now]
    );
    console.log(`🧹 Cleanup: ${deletedPasswords.changes + deletedPersonalInfo.changes + deletedUuids.changes} expired records deleted`);
  }

  async getStats(): Promise<any> {
    const stats = await Promise.all([
      this.get('SELECT COUNT(*) as count FROM generated_passwords'),
      this.get('SELECT COUNT(*) as count FROM generated_personal_info'), 
      this.get('SELECT COUNT(*) as count FROM generated_uuids'),
      this.get('SELECT COUNT(*) as count FROM claude_generations'),
      this.get('SELECT COUNT(*) as count FROM api_statistics'),
      this.get('SELECT COUNT(*) as count FROM error_logs'),
    ]);

    const dbSize = fs.existsSync(this.dbPath) ? fs.statSync(this.dbPath).size : 0;

    return {
      passwords: { count: stats[0]?.count || 0 },
      personalInfo: { count: stats[1]?.count || 0 },
      uuids: { count: stats[2]?.count || 0 },
      claudeData: { count: stats[3]?.count || 0 },
      apiCalls: { count: stats[4]?.count || 0 },
      errors: { count: stats[5]?.count || 0 },
      dbSize
    };
  }
}

export const database = new DatabaseService(); 