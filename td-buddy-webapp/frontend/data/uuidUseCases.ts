export interface UuidUseCase {
  id: string;
  title: string;
  description: string;
  category: 'database' | 'api' | 'file' | 'session' | 'tracking' | 'microservice' | 'testing' | 'security';
  scenario: string;
  beforeExample?: string;
  uuidExample: string;
  afterExample?: string;
  benefits: string[];
  recommendedVersion: 'v1' | 'v4' | 'v6' | 'v7';
  codeExample: {
    language: string;
    code: string;
  };
}

export const uuidUseCases: UuidUseCase[] = [
  {
    id: 'database-primary-key',
    title: 'データベースの主キー',
    description: 'テーブルの主キーとしてUUIDを使用することで、分散システムでも一意性を保証',
    category: 'database',
    scenario: 'ユーザー管理システムで、複数のデータベースサーバー間でデータを同期する場合',
    beforeExample: 'ID: 1, 2, 3... (重複の可能性)',
    uuidExample: 'user_id: 550e8400-e29b-41d4-a716-446655440000',
    afterExample: '全システムで一意なユーザーID',
    benefits: [
      '複数データベース間で重複しない',
      'マージ時の競合が発生しない',
      'プライマリーキーが予測できない',
      'レプリケーション時の問題回避'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'sql',
      code: `-- ユーザーテーブル作成
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- データ挿入
INSERT INTO users (user_id, username, email) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'testuser', 'test@example.com');`
    }
  },
  {
    id: 'api-request-tracing',
    title: 'APIリクエストの追跡ID',
    description: 'リクエストごとに一意のIDを付与してログ追跡を容易にする',
    category: 'api',
    scenario: 'マイクロサービス間の API 呼び出しで、リクエストの流れを追跡したい場合',
    beforeExample: 'ログが散らばって追跡困難',
    uuidExample: 'X-Request-ID: 6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    afterExample: 'すべてのログでリクエストを一意に識別',
    benefits: [
      'リクエストの全体的な流れを追跡可能',
      'デバッグが容易になる',
      'パフォーマンス分析が可能',
      'エラーの根本原因を特定しやすい'
    ],
    recommendedVersion: 'v7',
    codeExample: {
      language: 'javascript',
      code: `// Express.js middleware
app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  console.log(\`[\${req.requestId}] \${req.method} \${req.path}\`);
  next();
});

// ログ出力例
app.get('/api/users', (req, res) => {
  console.log(\`[\${req.requestId}] Fetching users from database\`);
  // データ取得処理
  console.log(\`[\${req.requestId}] Found \${users.length} users\`);
  res.json(users);
});`
    }
  },
  {
    id: 'file-unique-naming',
    title: 'ファイル名の一意化',
    description: 'アップロードファイルやレポート生成時の重複しないファイル名作成',
    category: 'file',
    scenario: 'ユーザーが画像をアップロードする際、同名ファイルの上書きを防ぎたい場合',
    beforeExample: 'image.jpg → 上書きリスク',
    uuidExample: 'image_6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg',
    afterExample: '絶対に重複しないファイル名',
    benefits: [
      'ファイル名の衝突を完全に回避',
      'オリジナルファイル名も保持可能',
      'ファイル管理が簡単',
      'セキュリティ向上（推測困難）'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'javascript',
      code: `// ファイルアップロード処理
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    
    // 一意なファイル名を生成
    const filename = \`\${basename}_\${uniqueId}\${ext}\`;
    cb(null, filename);
  }
});

// 使用例: profile_6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg`
    }
  },
  {
    id: 'session-management',
    title: 'セッション管理',
    description: 'Webアプリケーションのセッション識別子として使用',
    category: 'session',
    scenario: 'ユーザーログイン後のセッション管理で、推測困難で一意なセッションIDが必要',
    beforeExample: 'session123 → 推測可能',
    uuidExample: 'session_id: f47ac10b-58cc-4372-a567-0e02b2c3d479',
    afterExample: '推測不可能で安全なセッション',
    benefits: [
      'セッションハイジャック攻撃を防止',
      '推測不可能で高セキュリティ',
      '一意性が完全に保証される',
      'スケールアウト時も問題なし'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'javascript',
      code: `// Express.js + express-session
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

app.use(session({
  genid: () => uuidv4(), // セッションIDをUUIDで生成
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
}));

// ユーザーログイン処理
app.post('/login', (req, res) => {
  // 認証処理
  req.session.userId = user.id;
  console.log(\`Session created: \${req.sessionID}\`);
  // f47ac10b-58cc-4372-a567-0e02b2c3d479
});`
    }
  },
  {
    id: 'tracking-analytics',
    title: 'トラッキング・分析ID',
    description: 'ユーザー行動分析やイベント追跡のための識別子',
    category: 'tracking',
    scenario: 'Webサイトでユーザーの行動を追跡し、コンバージョン分析を行いたい場合',
    beforeExample: '匿名ユーザーの行動が追跡できない',
    uuidExample: 'tracking_id: 12345678-1234-5678-90ab-123456789abc',
    afterExample: 'ユーザーごとの詳細な行動分析が可能',
    benefits: [
      'プライバシーを保護しながら追跡',
      'ユーザー体験の改善データ取得',
      'A/Bテストの効果測定',
      'コンバージョン経路の分析'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'javascript',
      code: `// Google Analytics風のトラッキング
class Analytics {
  constructor() {
    this.visitorId = this.getVisitorId();
  }
  
  getVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }
  
  trackEvent(category, action, label) {
    const event = {
      visitor_id: this.visitorId,
      event_id: uuidv4(),
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    };
    
    // 分析サーバーに送信
    this.sendToAnalytics(event);
  }
}

// 使用例
const analytics = new Analytics();
analytics.trackEvent('button', 'click', 'header-cta');`
    }
  },
  {
    id: 'microservice-correlation',
    title: 'マイクロサービス間の相関ID',
    description: '複数のサービス間でリクエストを関連付けるための識別子',
    category: 'microservice',
    scenario: 'eコマースサイトで注文処理が複数のマイクロサービス（在庫、決済、配送）を経由する場合',
    beforeExample: 'サービス間の処理が追跡できない',
    uuidExample: 'correlation_id: 9f4e8c2d-1a5b-4c7e-9d3f-2e8a6b4c7d9e',
    afterExample: '全サービス間での処理の流れが明確',
    benefits: [
      '分散システムでのデバッグが容易',
      '処理時間の分析が可能',
      'エラーの発生源を特定しやすい',
      'システム全体の可視化'
    ],
    recommendedVersion: 'v7',
    codeExample: {
      language: 'javascript',
      code: `// 注文サービス
app.post('/orders', async (req, res) => {
  const correlationId = uuidv4();
  
  try {
    // 在庫確認サービス
    await inventoryService.checkStock(req.body.items, { correlationId });
    
    // 決済サービス
    await paymentService.processPayment(req.body.payment, { correlationId });
    
    // 配送サービス
    await shippingService.scheduleDelivery(req.body.address, { correlationId });
    
    res.json({ orderId: uuidv4(), correlationId });
  } catch (error) {
    console.error(\`[\${correlationId}] Order failed: \${error.message}\`);
    res.status(500).json({ error: 'Order processing failed', correlationId });
  }
});

// 各サービスでの共通ログ出力
function logWithCorrelation(correlationId, message) {
  console.log(\`[\${correlationId}] \${message}\`);
}`
    }
  },
  {
    id: 'test-data-identification',
    title: 'テストデータの識別子',
    description: 'テスト用データの一意識別とテスト後のクリーンアップ',
    category: 'testing',
    scenario: '自動テストでテストデータを作成し、テスト後に確実に削除したい場合',
    beforeExample: 'テストデータが本番に残る可能性',
    uuidExample: 'test_user_id: test_550e8400-e29b-41d4-a716-446655440000',
    afterExample: 'テストデータを確実に識別・削除',
    benefits: [
      'テストデータの確実な識別',
      'テスト後の自動クリーンアップ',
      '本番データとの分離',
      'テストの独立性確保'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'javascript',
      code: `// テストデータ生成ヘルパー
class TestDataHelper {
  constructor() {
    this.testRunId = uuidv4();
    this.createdEntities = [];
  }
  
  async createTestUser(userData = {}) {
    const testUserId = \`test_\${uuidv4()}\`;
    const user = await User.create({
      id: testUserId,
      testRunId: this.testRunId,
      ...userData,
      email: \`test_\${uuidv4()}@example.com\`
    });
    
    this.createdEntities.push({ type: 'user', id: testUserId });
    return user;
  }
  
  async cleanup() {
    // テストデータの一括削除
    for (const entity of this.createdEntities) {
      await this.deleteEntity(entity.type, entity.id);
    }
    console.log(\`Test run \${this.testRunId} cleaned up\`);
  }
}

// テストでの使用例
describe('User API', () => {
  let testHelper;
  
  beforeEach(() => {
    testHelper = new TestDataHelper();
  });
  
  afterEach(async () => {
    await testHelper.cleanup();
  });
  
  it('should create user', async () => {
    const user = await testHelper.createTestUser({ name: 'Test User' });
    expect(user.id).toMatch(/^test_[0-9a-f-]{36}$/);
  });
});`
    }
  },
  {
    id: 'temporary-tokens',
    title: '一時的なトークン・リンク',
    description: 'パスワードリセット、メール認証等の一時的で安全なトークン',
    category: 'security',
    scenario: 'ユーザーがパスワードを忘れた際の、安全なパスワードリセットリンク生成',
    beforeExample: '予測可能なトークン → セキュリティリスク',
    uuidExample: 'reset_token: 123e4567-e89b-12d3-a456-426614174000',
    afterExample: '推測不可能で期限付きの安全なトークン',
    benefits: [
      '推測・総当たり攻撃に強い',
      '一意性が保証される',
      '有効期限管理が容易',
      '使い捨てトークンとして利用'
    ],
    recommendedVersion: 'v4',
    codeExample: {
      language: 'javascript',
      code: `// パスワードリセット機能
class PasswordResetService {
  async generateResetToken(email) {
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間後
    
    // データベースに保存
    await PasswordResetToken.create({
      token: resetToken,
      email: email,
      expiresAt: expiresAt,
      used: false
    });
    
    // メール送信
    const resetLink = \`https://example.com/reset-password?token=\${resetToken}\`;
    await this.sendResetEmail(email, resetLink);
    
    return resetToken;
  }
  
  async validateResetToken(token) {
    const resetRecord = await PasswordResetToken.findOne({
      where: {
        token: token,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    
    if (!resetRecord) {
      throw new Error('Invalid or expired reset token');
    }
    
    return resetRecord;
  }
  
  async resetPassword(token, newPassword) {
    const resetRecord = await this.validateResetToken(token);
    
    // パスワード更新
    await User.update(
      { password: await bcrypt.hash(newPassword, 10) },
      { where: { email: resetRecord.email } }
    );
    
    // トークンを使用済みにマーク
    await resetRecord.update({ used: true });
  }
}

// 使用例
const service = new PasswordResetService();
await service.generateResetToken('user@example.com');
// メールリンク: https://example.com/reset-password?token=123e4567-e89b-12d3-a456-426614174000`
    }
  }
];

export const getCategorizedUseCases = () => {
  const categories = {
    database: { name: 'データベース', icon: '🗄️' },
    api: { name: 'API・Web開発', icon: '🌐' },
    file: { name: 'ファイル管理', icon: '📁' },
    session: { name: 'セッション管理', icon: '🔐' },
    tracking: { name: 'トラッキング・分析', icon: '📊' },
    microservice: { name: 'マイクロサービス', icon: '⚙️' },
    testing: { name: 'テスト・QA', icon: '🧪' },
    security: { name: 'セキュリティ', icon: '🛡️' }
  };

  const categorized: Record<string, typeof uuidUseCases> = {};
  
  Object.keys(categories).forEach(key => {
    categorized[key] = uuidUseCases.filter(useCase => useCase.category === key);
  });

  return { categories, categorized };
}; 