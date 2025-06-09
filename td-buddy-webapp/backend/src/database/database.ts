// Simple database service for now
export class DatabaseService {
  async connect(): Promise<void> {
    console.log('Database connected');
  }

  async disconnect(): Promise<void> {
    console.log('Database disconnected');
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    console.log('Database query:', sql);
    return { changes: 0, lastInsertRowid: 0 };
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    console.log('Database query:', sql);
    return [];
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    console.log('Database query:', sql);
    return null;
  }

  async initialize(): Promise<void> {
    console.log('Database initialized');
  }

  async cleanupExpiredData(): Promise<void> {
    console.log('Cleanup completed');
  }

  async getStats(): Promise<any> {
    return {
      passwords: { count: 0 },
      personalInfo: { count: 0 },
      claudeData: { count: 0 },
      apiCalls: { count: 0 },
      errors: { count: 0 },
      dbSize: 0
    };
  }
}

export const database = new DatabaseService(); 