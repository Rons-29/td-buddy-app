# Claude API 統合ガイド

## API キー設定

### 1. Anthropic アカウント作成
1. https://console.anthropic.com/ にアクセス
2. アカウント作成・ログイン
3. API Keys セクションでキー生成
4. 使用量制限・料金プランを確認

### 2. 環境変数設定
```bash
# .env ファイル
CLAUDE_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-3-sonnet-20240229
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.1
```

## プロンプト設計

### システムプロンプト
```typescript
const SYSTEM_PROMPT = `
あなたはTestData Buddyのテストデータ生成アシスタントです。
ユーザーの自然言語による指示を、以下のJSONスキーマに従って構造化してください。

利用可能なアクション:
1. generatePassword - パスワード生成
2. generateText - テキスト生成  
3. generateFile - ファイル生成
4. generatePersonalInfo - 個人情報生成
5. convertKanji - 旧字体変換

レスポンス形式:
{
  "action": "アクション名",
  "parameters": {
    // アクション固有のパラメータ
  },
  "reasoning": "判断理由"
}

必ず有効なJSONのみを返してください。
`;
```

### 実装例
```typescript
// src/modules/ai/claude.service.ts
import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async parseNaturalLanguage(prompt: string): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
        temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.1'),
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`AI処理エラー: ${error.message}`);
    }
  }
}
```

## エラーハンドリング

### レート制限対応
```typescript
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

async function callClaudeWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await claudeService.parseNaturalLanguage(prompt);
    } catch (error) {
      if (error.status === 429) { // Rate limit
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

## 料金最適化

### トークン数管理
```typescript
function estimateTokens(text: string): number {
  // 簡易的な見積もり（実際はtiktokenライブラリ使用推奨）
  return Math.ceil(text.length / 4);
}

function optimizePrompt(userPrompt: string): string {
  // 不要な文字を削除、簡潔化
  return userPrompt
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 1000); // 最大長制限
}
``` 