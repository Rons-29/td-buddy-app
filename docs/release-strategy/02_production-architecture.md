# 🏗️ Web版本番環境アーキテクチャ設計
# TestData Buddy (TD) 本番環境アーキテクチャ

## 🎯 設計方針

### アーキテクチャ原則
- **スケーラビリティ**: 急激なユーザー増加に対応可能
- **可用性**: 99.9%以上の稼働率を保証
- **セキュリティ**: エンタープライズレベルのセキュリティ
- **保守性**: 運用・メンテナンスが容易
- **コスト効率**: 段階的なスケールアップが可能

**TDからのメッセージ**: 「本番環境では、安全性と性能を最優先に設計しました！」

## 🚀 システム全体構成

### 高レベルアーキテクチャ図
```mermaid
graph TB
    User[👥 ユーザー] --> CDN[🌐 CloudFlare CDN]
    CDN --> LB[⚖️ Load Balancer]
    LB --> App1[🖥️ App Server 1]
    LB --> App2[🖥️ App Server 2]
    LB --> App3[🖥️ App Server 3]
    
    App1 --> Cache[📦 Redis Cache]
    App2 --> Cache
    App3 --> Cache
    
    App1 --> DB[(🗄️ PostgreSQL)]
    App2 --> DB
    App3 --> DB
    
    App1 --> Files[📁 File Storage]
    App2 --> Files
    App3 --> Files
    
    subgraph "Monitoring & Logging"
        Monitor[📊 Monitoring]
        Logs[📋 Logging]
    end
    
    App1 --> Monitor
    App2 --> Monitor  
    App3 --> Monitor
    
    App1 --> Logs
    App2 --> Logs
    App3 --> Logs
    
    subgraph "External Services"
        Claude[🧠 Claude AI]
        Email[📧 Email Service]
        Backup[💾 Backup Storage]
    end
    
    App1 --> Claude
    App2 --> Claude
    App3 --> Claude
    
    DB --> Backup
    Files --> Backup
```

## 🛠️ 技術スタック詳細

### フロントエンド
```typescript
// Next.js 14 + React 18
// 本番最適化設定

// next.config.js
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['cdn.td-buddy.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL,
  },
  // バンドル最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

### バックエンドAPI
```typescript
// Express.js + TypeScript
// 高可用性・高パフォーマンス設定

// 本番環境設定
const productionConfig = {
  port: process.env.PORT || 3001,
  cors: {
    origin: ['https://td-buddy.com', 'https://www.td-buddy.com'],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分
    max: 100, // リクエスト制限
    standardHeaders: true,
    legacyHeaders: false,
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    pool: {
      min: 2,
      max: 20,
      acquire: 30000,
      idle: 10000,
    },
  },
};
```

## 🗄️ データベース設計

### PostgreSQL 本番構成
```sql
-- 本番環境用データベース設計

-- パフォーマンス最適化設定
-- postgresql.conf設定
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1

-- 接続設定
max_connections = 100
listen_addresses = '*'
port = 5432

-- ログ設定
log_destination = 'stderr'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'mod'
log_min_duration_statement = 1000
```

### テーブル設計（本番最適化）
```sql
-- ユーザーテーブル（将来の認証機能用）
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    plan_type VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 生成データ履歴テーブル
CREATE TABLE generation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    data_type VARCHAR(50) NOT NULL,
    parameters JSONB,
    generated_count INTEGER,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- システム統計テーブル
CREATE TABLE usage_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_generations INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    data_type_breakdown JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成（パフォーマンス最適化）
CREATE INDEX idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX idx_generation_history_created_at ON generation_history(created_at);
CREATE INDEX idx_generation_history_expires_at ON generation_history(expires_at);
CREATE INDEX idx_usage_statistics_date ON usage_statistics(date);

-- パーティショニング（大量データ対応）
CREATE TABLE generation_history_y2025m01 PARTITION OF generation_history
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- 月ごとにパーティションを追加...
```

## 🔧 インフラストラクチャ

### Docker 構成
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]

# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3001
USER node
CMD ["npm", "start"]
```

### Docker Compose（本番環境）
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./td-buddy-webapp/frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.td-buddy.com
    restart: unless-stopped
    networks:
      - td-network

  backend:
    build:
      context: ./td-buddy-webapp/backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/td_buddy
      - REDIS_URL=redis://redis:6379
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - td-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=td_buddy
      - POSTGRES_USER=td_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - td-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - td-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - td-network

volumes:
  postgres_data:
  redis_data:

networks:
  td-network:
    driver: bridge
```

## ⚖️ ロードバランサー & リバースプロキシ

### Nginx 設定
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:3001;
    }
    
    # レート制限設定
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;
    
    server {
        listen 80;
        server_name td-buddy.com www.td-buddy.com;
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name td-buddy.com www.td-buddy.com;
        
        ssl_certificate /etc/ssl/certs/td-buddy.crt;
        ssl_certificate_key /etc/ssl/certs/td-buddy.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        
        # セキュリティヘッダー
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # フロントエンド（Next.js）
        location / {
            limit_req zone=web burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # API（Express.js）
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # 静的ファイル
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 📊 監視・ログ設定

### アプリケーション監視
```typescript
// monitoring.ts
import { createPrometheusMetrics } from 'prom-client';

export const metrics = {
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
  }),
  
  dataGenerationCount: new Counter({
    name: 'data_generation_total',
    help: 'Total number of data generations',
    labelNames: ['type', 'success'],
  }),
  
  activeUsers: new Gauge({
    name: 'active_users',
    help: 'Number of currently active users',
  }),
  
  databaseConnections: new Gauge({
    name: 'database_connections',
    help: 'Number of active database connections',
  }),
};

// ヘルスチェックエンドポイント
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    database: await checkDatabaseHealth(),
    redis: await checkRedisHealth(),
    claude: await checkClaudeAPIHealth(),
  };
  
  res.json(health);
});
```

### ログ設定
```typescript
// logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'td-buddy-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// 構造化ログ
export const logDataGeneration = (data: {
  userId?: string;
  dataType: string;
  count: number;
  duration: number;
  success: boolean;
}) => {
  logger.info('Data generation completed', data);
};
```

## 🔐 セキュリティ強化

### SSL/TLS 設定
```bash
# SSL証明書設定（Let's Encrypt）
# certbot設定
certbot certonly --webroot \
  -w /var/www/certbot \
  -d td-buddy.com \
  -d www.td-buddy.com \
  --email admin@td-buddy.com \
  --agree-tos \
  --non-interactive

# 自動更新設定
0 12 * * * /usr/bin/certbot renew --quiet
```

### WAF（Web Application Firewall）
```nginx
# ModSecurity設定例
SecRuleEngine On
SecDefaultAction "phase:1,log,auditlog,deny,status:403"

# SQLインジェクション対策
SecRule ARGS "@detectSQLi" \
    "id:1001,phase:2,block,msg:'SQL Injection Attack Detected'"

# XSS対策
SecRule ARGS "@detectXSS" \
    "id:1002,phase:2,block,msg:'XSS Attack Detected'"

# ファイルアップロード制限
SecRule REQUEST_HEADERS:Content-Type "^multipart/form-data" \
    "id:1003,phase:1,t:lowercase,chain"
SecRule ARGS_POST "@fileMatch /(\.exe|\.bat|\.cmd|\.sh|\.php)$/i" \
    "block,msg:'Dangerous file extension'"
```

## 📦 CDN・キャッシュ戦略

### CloudFlare 設定
```javascript
// cloudflare-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 静的ファイルの長期キャッシュ
  if (url.pathname.startsWith('/static/')) {
    const response = await fetch(request)
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
    return modifiedResponse
  }
  
  // API レスポンスの短期キャッシュ
  if (url.pathname.startsWith('/api/generate/')) {
    const cacheKey = new Request(url.toString(), request)
    const cache = caches.default
    let response = await cache.match(cacheKey)
    
    if (!response) {
      response = await fetch(request)
      if (response.status === 200) {
        const responseToCache = response.clone()
        response.headers.set('Cache-Control', 'public, max-age=300')
        event.waitUntil(cache.put(cacheKey, responseToCache))
      }
    }
    return response
  }
  
  return fetch(request)
}
```

## 💾 バックアップ・災害復旧

### 自動バックアップスクリプト
```bash
#!/bin/bash
# backup.sh - 自動バックアップスクリプト

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/td-buddy/$TIMESTAMP"
mkdir -p $BACKUP_DIR

# データベースバックアップ
pg_dump -h postgres -U td_user td_buddy > $BACKUP_DIR/database.sql

# ファイルバックアップ
tar -czf $BACKUP_DIR/files.tar.gz /app/uploads /app/generated

# 設定ファイルバックアップ
cp -r /app/config $BACKUP_DIR/

# S3にアップロード
aws s3 cp $BACKUP_DIR s3://td-buddy-backups/$TIMESTAMP --recursive

# 古いバックアップの削除（30日以上）
find /backup/td-buddy -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completed: $TIMESTAMP"
```

### 災害復旧手順
```bash
#!/bin/bash
# restore.sh - 災害復旧スクリプト

BACKUP_TIMESTAMP=$1

if [ -z "$BACKUP_TIMESTAMP" ]; then
    echo "Usage: ./restore.sh <backup_timestamp>"
    exit 1
fi

# S3からバックアップをダウンロード
aws s3 cp s3://td-buddy-backups/$BACKUP_TIMESTAMP /restore/$BACKUP_TIMESTAMP --recursive

# データベース復旧
psql -h postgres -U td_user -d td_buddy < /restore/$BACKUP_TIMESTAMP/database.sql

# ファイル復旧
tar -xzf /restore/$BACKUP_TIMESTAMP/files.tar.gz -C /

# 設定ファイル復旧
cp -r /restore/$BACKUP_TIMESTAMP/config /app/

echo "Restore completed: $BACKUP_TIMESTAMP"
```

## 🚀 デプロイメント戦略

### Blue-Green デプロイメント
```yaml
# blue-green-deploy.yml
version: '3.8'

services:
  # Blue環境（現在稼働中）
  frontend-blue:
    image: td-buddy/frontend:v1.0.0
    networks:
      - td-network-blue
    
  backend-blue:
    image: td-buddy/backend:v1.0.0
    networks:
      - td-network-blue
  
  # Green環境（新バージョン）
  frontend-green:
    image: td-buddy/frontend:v1.1.0
    networks:
      - td-network-green
    
  backend-green:
    image: td-buddy/backend:v1.1.0
    networks:
      - td-network-green

  # ロードバランサー（切り替え制御）
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx-blue-green.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
```

### CI/CD パイプライン
```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker build -t td-buddy/frontend:${{ github.ref_name }} ./td-buddy-webapp/frontend
          docker build -t td-buddy/backend:${{ github.ref_name }} ./td-buddy-webapp/backend
      
      - name: Run security scan
        run: |
          docker run --rm -v $(pwd):/project clair-scanner
      
      - name: Deploy to staging
        run: |
          docker-compose -f docker-compose.staging.yml up -d
      
      - name: Run integration tests
        run: |
          npm run test:integration:production
      
      - name: Deploy to production
        if: success()
        run: |
          # Blue-Green デプロイメント実行
          ./scripts/blue-green-deploy.sh ${{ github.ref_name }}
      
      - name: Health check
        run: |
          curl -f https://td-buddy.com/health
      
      - name: Rollback on failure
        if: failure()
        run: |
          ./scripts/rollback.sh
```

## 📈 パフォーマンス最適化

### Redis キャッシュ戦略
```typescript
// cache.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

export class CacheService {
  // 生成データのキャッシュ（5分間）
  async cacheGeneratedData(key: string, data: any): Promise<void> {
    await redis.setex(`generated:${key}`, 300, JSON.stringify(data));
  }
  
  // セッション情報のキャッシュ（1時間）
  async cacheSession(sessionId: string, data: any): Promise<void> {
    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(data));
  }
  
  // API レスポンスのキャッシュ（10分間）
  async cacheAPIResponse(endpoint: string, params: any, response: any): Promise<void> {
    const key = `api:${endpoint}:${Buffer.from(JSON.stringify(params)).toString('base64')}`;
    await redis.setex(key, 600, JSON.stringify(response));
  }
}
```

### データベース最適化
```sql
-- パフォーマンス最適化クエリ

-- 統計情報の更新
ANALYZE;

-- インデックス使用状況の確認
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public';

-- 遅いクエリの監視
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 接続プール最適化
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';
```

## 📊 運用・監視体制

### KPI監視ダッシュボード
```typescript
// metrics-dashboard.ts
export const monitoringMetrics = {
  // システムメトリクス
  system: {
    cpuUsage: 'avg(cpu_usage) < 80',
    memoryUsage: 'avg(memory_usage) < 85',
    diskUsage: 'avg(disk_usage) < 90',
  },
  
  // アプリケーションメトリクス
  application: {
    responseTime: 'avg(response_time) < 3000',
    errorRate: 'error_rate < 1',
    throughput: 'requests_per_second > 10',
  },
  
  // ビジネスメトリクス
  business: {
    dailyActiveUsers: 'daily_active_users > 50',
    dataGenerationSuccess: 'generation_success_rate > 95',
    userSatisfaction: 'user_satisfaction > 4.0',
  },
};

// アラート設定
export const alertRules = [
  {
    name: 'High Error Rate',
    condition: 'error_rate > 5',
    severity: 'critical',
    notification: ['email', 'slack'],
  },
  {
    name: 'Slow Response Time',
    condition: 'avg(response_time) > 5000',
    severity: 'warning',
    notification: ['slack'],
  },
  {
    name: 'Database Connection Pool Full',
    condition: 'db_connections > 90',
    severity: 'critical',
    notification: ['email', 'slack', 'sms'],
  },
];
```

---

## 🎉 TDからの総括メッセージ

```
🤖 「本番環境アーキテクチャの設計が完了しました！

🏗️ スケーラブルで安全な設計になっています
⚡ パフォーマンスも十分に考慮されています
🛡️ セキュリティ対策も万全です
📊 監視・運用体制も整っています

これで安心してWeb版をリリースできますね！
世界中のQAエンジニアの皆様にお届けする準備が整いました♪

何か質問や不明な点があれば、いつでもTDにお聞きください！」
```

**次のステップ**: CI/CDパイプラインの詳細設計と、デプロイメント自動化の実装を進めましょう！ 