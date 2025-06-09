# TestData Buddy VSCode/Cursor拡張機能 統合実装ガイド

VSCode/Cursor拡張機能として動作するTestData BuddyのMCP統合とCursor連携実装ガイドです。

## 1. 拡張機能エントリーポイント

### extension.ts
```typescript
import * as vscode from 'vscode';
import { TestDataBuddyExtension } from './services/extension.service';
import { registerCommands } from './commands';
import { HistoryTreeProvider } from './ui/tree-view/history-provider';
import { StatusBarProvider } from './ui/status-bar/status-provider';

let extension: TestDataBuddyExtension;

export async function activate(context: vscode.ExtensionContext) {
    console.log('TestData Buddy 拡張機能が有効化されました');

    // 拡張機能サービス初期化
    extension = new TestDataBuddyExtension(context);
    await extension.initialize();

    // コマンド登録
    registerCommands(context, extension);

    // UI プロバイダー登録
    const historyProvider = new HistoryTreeProvider(extension.storageService);
    vscode.window.createTreeView('testdata-buddy-history', {
        treeDataProvider: historyProvider
    });

    // ステータスバー登録
    const statusBarProvider = new StatusBarProvider();
    statusBarProvider.show();

    // Webview パネル登録
    context.subscriptions.push(
        vscode.commands.registerCommand('testdata-buddy.openPanel', () => {
            extension.showWebviewPanel();
        })
    );

    console.log('TestData Buddy 拡張機能の初期化が完了しました');
}

export function deactivate() {
    extension?.dispose();
}
```

## 2. 拡張機能サービス

### services/extension.service.ts
```typescript
import * as vscode from 'vscode';
import { StorageService } from './storage/sqlite.service';
import { PasswordService } from './generators/password.service';
import { PersonalInfoService } from './generators/personal-info.service';
import { FileService } from './generators/file.service';
import { McpService } from './ai/mcp.service';
import { ClaudeService } from './ai/claude.service';

export class TestDataBuddyExtension {
    private webviewPanel?: vscode.WebviewPanel;
    
    public readonly storageService: StorageService;
    public readonly passwordService: PasswordService;
    public readonly personalInfoService: PersonalInfoService;
    public readonly fileService: FileService;
    public readonly mcpService: McpService;
    public readonly claudeService: ClaudeService;

    constructor(private context: vscode.ExtensionContext) {
        this.storageService = new StorageService(context);
        this.passwordService = new PasswordService();
        this.personalInfoService = new PersonalInfoService();
        this.fileService = new FileService();
        this.mcpService = new McpService(this);
        this.claudeService = new ClaudeService(this.mcpService);
    }

    async initialize(): Promise<void> {
        await this.storageService.initialize();
        await this.mcpService.initialize();
    }

    showWebviewPanel(): void {
        if (this.webviewPanel) {
            this.webviewPanel.reveal();
            return;
        }

        this.webviewPanel = vscode.window.createWebviewPanel(
            'testdataBuddy',
            'TestData Buddy',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(this.context.extensionUri, 'out', 'webview')
                ]
            }
        );

        this.webviewPanel.webview.html = this.getWebviewContent();
        
        this.webviewPanel.onDidDispose(() => {
            this.webviewPanel = undefined;
        });

        this.webviewPanel.webview.onDidReceiveMessage(
            message => this.handleWebviewMessage(message)
        );
    }

    private getWebviewContent(): string {
        const scriptUri = this.webviewPanel!.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'out', 'webview', 'index.js')
        );
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TestData Buddy</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="${scriptUri}"></script>
        </body>
        </html>`;
    }

    private async handleWebviewMessage(message: any): Promise<void> {
        switch (message.command) {
            case 'generatePassword':
                const password = await this.passwordService.generate(message.config);
                this.webviewPanel!.webview.postMessage({
                    command: 'passwordGenerated',
                    data: password
                });
                break;
            
            case 'naturalLanguageGenerate':
                const result = await this.claudeService.processNaturalLanguage(message.prompt);
                this.webviewPanel!.webview.postMessage({
                    command: 'dataGenerated',
                    data: result
                });
                break;
        }
    }

    dispose(): void {
        this.webviewPanel?.dispose();
        this.storageService.dispose();
    }
}
```

## 3. コマンド実装

### commands/index.ts
```typescript
import * as vscode from 'vscode';
import { TestDataBuddyExtension } from '../services/extension.service';
import { registerPasswordCommands } from './generate/password';
import { registerPersonalInfoCommands } from './generate/personal-info';
import { registerFileCommands } from './generate/file-data';
import { registerAiCommands } from './ai/mcp-client';

export function registerCommands(
    context: vscode.ExtensionContext,
    extension: TestDataBuddyExtension
): void {
    registerPasswordCommands(context, extension);
    registerPersonalInfoCommands(context, extension);
    registerFileCommands(context, extension);
    registerAiCommands(context, extension);
}
```

### commands/generate/password.ts
```typescript
import * as vscode from 'vscode';
import { TestDataBuddyExtension } from '../../services/extension.service';

export function registerPasswordCommands(
    context: vscode.ExtensionContext,
    extension: TestDataBuddyExtension
): void {
    
    // パスワード生成コマンド
    const generatePasswordCommand = vscode.commands.registerCommand(
        'testdata-buddy.generate.password',
        async () => {
            const options = await showPasswordOptions();
            if (!options) return;

            const password = await extension.passwordService.generate(options);
            
            // アクティブエディタに挿入
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, password);
                });
            }

            // 履歴保存
            await extension.storageService.saveGenerationHistory({
                type: 'password',
                data: { password: '***' },
                config: options,
                timestamp: new Date()
            });

            vscode.window.showInformationMessage('パスワードが生成されました');
        }
    );

    context.subscriptions.push(generatePasswordCommand);
}

async function showPasswordOptions(): Promise<any> {
    const length = await vscode.window.showInputBox({
        prompt: 'パスワードの長さを入力してください',
        value: '12',
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 4 || num > 128) {
                return 'パスワード長は4-128の範囲で入力してください';
            }
            return undefined;
        }
    });

    if (!length) return undefined;

    const includeSymbols = await vscode.window.showQuickPick(
        ['はい', 'いいえ'],
        { placeHolder: '記号を含めますか？' }
    );

    if (!includeSymbols) return undefined;

    return {
        length: parseInt(length),
        includeUpper: true,
        includeLower: true,
        includeNumbers: true,
        includeSymbols: includeSymbols === 'はい'
    };
}
```

## 4. MCP（Model Context Protocol）実装

### services/ai/mcp.service.ts
```typescript
import { TestDataBuddyExtension } from '../extension.service';

interface McpTool {
    name: string;
    description: string;
    inputSchema: any;
}

export class McpService {
    private tools: McpTool[] = [];

    constructor(private extension: TestDataBuddyExtension) {
        this.initializeTools();
    }

    async initialize(): Promise<void> {
        // MCP サービス初期化
        console.log('MCP サービスが初期化されました');
    }

    private initializeTools(): void {
        this.tools = [
            {
                name: 'generate_password',
                description: 'パスワードを生成します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        length: { type: 'number', default: 12 },
                        includeSymbols: { type: 'boolean', default: false },
                        count: { type: 'number', default: 1 }
                    }
                }
            },
            {
                name: 'generate_personal_info',
                description: '擬似個人情報を生成します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', default: 1 },
                        fields: { 
                            type: 'array',
                            items: { type: 'string' },
                            default: ['fullName', 'email']
                        },
                        locale: { type: 'string', default: 'ja' }
                    }
                }
            },
            {
                name: 'generate_file_data',
                description: 'テスト用ファイルデータを生成します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        format: { type: 'string', enum: ['csv', 'json', 'xml'] },
                        rows: { type: 'number', default: 10 },
                        schema: { type: 'object' }
                    }
                }
            },
            {
                name: 'generate_random_text',
                description: 'ランダムテキストを生成します',
                inputSchema: {
                    type: 'object',
                    properties: {
                        type: { 
                            type: 'string', 
                            enum: ['hiragana', 'katakana', 'kanji', 'mixed'] 
                        },
                        length: { type: 'number', default: 10 }
                    }
                }
            }
        ];
    }

    getTools(): McpTool[] {
        return this.tools;
    }

    async callTool(name: string, args: any): Promise<any> {
        switch (name) {
            case 'generate_password':
                return await this.generatePassword(args);
            
            case 'generate_personal_info':
                return await this.generatePersonalInfo(args);
            
            case 'generate_file_data':
                return await this.generateFileData(args);
            
            case 'generate_random_text':
                return await this.generateRandomText(args);
            
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }

    private async generatePassword(args: any): Promise<string> {
        const { length = 12, includeSymbols = false, count = 1 } = args;
        
        const passwords = [];
        for (let i = 0; i < count; i++) {
            const password = await this.extension.passwordService.generate({
                length,
                includeUpper: true,
                includeLower: true,
                includeNumbers: true,
                includeSymbols
            });
            passwords.push(password);
        }

        // 履歴保存
        await this.extension.storageService.saveGenerationHistory({
            type: 'password',
            data: { count },
            config: args,
            timestamp: new Date()
        });

        return passwords.join('\n');
    }

    private async generatePersonalInfo(args: any): Promise<string> {
        const { count = 1, fields = ['fullName', 'email'], locale = 'ja' } = args;
        
        const data = await this.extension.personalInfoService.generate({
            count,
            fields,
            locale
        });

        const formatted = data.map(item => 
            fields.map(field => `${field}: ${item[field]}`).join(', ')
        ).join('\n');

        // 履歴保存
        await this.extension.storageService.saveGenerationHistory({
            type: 'personal_info',
            data: { count, fields },
            config: args,
            timestamp: new Date()
        });

        return formatted;
    }

    private async generateFileData(args: any): Promise<string> {
        const { format, rows = 10, schema } = args;
        
        const result = await this.extension.fileService.generate({
            format,
            rows,
            schema: schema || this.getDefaultSchema(format)
        });

        // 履歴保存
        await this.extension.storageService.saveGenerationHistory({
            type: 'file_data',
            data: result,
            config: args,
            timestamp: new Date()
        });

        return `${format.toUpperCase()}データが生成されました:\n${result.content}`;
    }

    private async generateRandomText(args: any): Promise<string> {
        const { type, length = 10 } = args;
        
        const kanjiService = this.extension.kanjiService;
        let result = '';

        switch (type) {
            case 'hiragana':
                result = kanjiService.generateHiragana(length);
                break;
            case 'katakana':
                result = kanjiService.generateKatakana(length);
                break;
            case 'kanji':
                result = kanjiService.generateKanji(length);
                break;
            case 'mixed':
                result = kanjiService.generateMixed(length);
                break;
        }

        // 履歴保存
        await this.extension.storageService.saveGenerationHistory({
            type: 'random_text',
            data: { result },
            config: args,
            timestamp: new Date()
        });

        return result;
    }

    private getDefaultSchema(format: string): any {
        switch (format) {
            case 'csv':
                return {
                    columns: ['id', 'name', 'email', 'age']
                };
            case 'json':
                return {
                    properties: {
                        id: 'number',
                        name: 'string',
                        email: 'email',
                        age: 'number'
                    }
                };
            case 'xml':
                return {
                    root: 'users',
                    element: 'user',
                    fields: ['id', 'name', 'email', 'age']
                };
            default:
                return {};
        }
    }
}
```

## 5. Claude API連携

### services/ai/claude.service.ts
```typescript
import * as vscode from 'vscode';
import { McpService } from './mcp.service';

export class ClaudeService {
    private apiKey?: string;
    private rateLimitTracker: Map<string, number> = new Map();
    private readonly RATE_LIMIT_WINDOW = 60000; // 1分
    private readonly MAX_REQUESTS_PER_WINDOW = 10;

    constructor(private mcpService: McpService) {
        this.loadApiKey();
    }

    private loadApiKey(): void {
        const config = vscode.workspace.getConfiguration('testdata-buddy');
        this.apiKey = config.get('ai.apiKey');
    }

    private checkRateLimit(): boolean {
        const now = Date.now();
        const windowStart = now - this.RATE_LIMIT_WINDOW;
        
        // 古いリクエストを削除
        for (const [timestamp, _] of this.rateLimitTracker) {
            if (parseInt(timestamp) < windowStart) {
                this.rateLimitTracker.delete(timestamp);
            }
        }
        
        // 現在のウィンドウでのリクエスト数をチェック
        if (this.rateLimitTracker.size >= this.MAX_REQUESTS_PER_WINDOW) {
            return false;
        }
        
        this.rateLimitTracker.set(now.toString(), now);
        return true;
    }

    private sanitizePrompt(prompt: string): string {
        // 悪意のあるプロンプトの検出と無害化
        if (prompt.includes('ignore previous instructions') || 
            prompt.includes('system prompt') || 
            prompt.length > 1000) {
            throw new Error('不正なプロンプトが検出されました');
        }
        return prompt.trim();
    }

    async processNaturalLanguage(prompt: string): Promise<string> {
        if (!this.apiKey) {
            vscode.window.showErrorMessage(
                'Claude API キーが設定されていません。設定から追加してください。'
            );
            return '';
        }

        if (!this.checkRateLimit()) {
            vscode.window.showWarningMessage(
                'API呼び出しの頻度制限に達しました。しばらく時間をおいてからお試しください。'
            );
            return '';
        }

        try {
            const sanitizedPrompt = this.sanitizePrompt(prompt);
            
            // Claude APIに自然言語プロンプトを送信
            const response = await this.callClaudeApi(sanitizedPrompt);
            
            // Claude AIが返すMCPツール呼び出しを実行
            if (response.content && response.content[0]?.type === 'tool_use') {
                const toolCall = response.content[0];
                const result = await this.mcpService.callTool(
                    toolCall.name,
                    toolCall.input
                );
                return result;
            }

            return response.content?.[0]?.text || 'データの生成に失敗しました';
        } catch (error) {
            console.error('Claude API呼び出しエラー:', error);
            vscode.window.showErrorMessage(
                `Claude API呼び出しに失敗しました: ${error.message}`
            );
            return '';
        }
    }

    private async callClaudeApi(prompt: string): Promise<any> {
        const tools = this.mcpService.getTools();
        
        const requestBody = {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: `${prompt}

利用可能なツール:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

適切なツールを選択して実行してください。セキュリティ上の理由により、個人情報や機密情報は生成しないでください。`
                }
            ],
            tools: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                input_schema: tool.inputSchema
            }))
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Claude API エラー: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('API呼び出しがタイムアウトしました');
            }
            throw error;
        }
    }
}
```

## 6. Cursor統合機能

### commands/ai/cursor-integration.ts
```typescript
import * as vscode from 'vscode';
import { TestDataBuddyExtension } from '../../services/extension.service';

export function registerCursorIntegration(
    context: vscode.ExtensionContext,
    extension: TestDataBuddyExtension
): void {
    
    // Cursor AI Chat統合
    const chatIntegrationCommand = vscode.commands.registerCommand(
        'testdata-buddy.cursor.chatIntegration',
        async () => {
            const selection = vscode.window.activeTextEditor?.selection;
            const selectedText = vscode.window.activeTextEditor?.document.getText(selection);
            
            if (selectedText) {
                // 選択されたテキストを使ってテストデータ生成
                const result = await extension.claudeService.processNaturalLanguage(
                    `次のコードに適したテストデータを生成してください: ${selectedText}`
                );
                
                // 結果をカーソル位置に挿入
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.end, `\n// Generated test data:\n${result}`);
                    });
                }
            }
        }
    );

    // Cursor Composer統合
    const composerIntegrationCommand = vscode.commands.registerCommand(
        'testdata-buddy.cursor.composerIntegration',
        async () => {
            const prompt = await vscode.window.showInputBox({
                prompt: 'テストデータ生成の要件を自然言語で入力してください',
                placeHolder: '例: 10人分の日本人の名前とメールアドレスのCSVデータを生成して'
            });

            if (prompt) {
                const result = await extension.claudeService.processNaturalLanguage(prompt);
                
                // 新しいドキュメントを作成して結果を表示
                const document = await vscode.workspace.openTextDocument({
                    content: result,
                    language: 'plaintext'
                });
                await vscode.window.showTextDocument(document);
            }
        }
    );

    context.subscriptions.push(chatIntegrationCommand, composerIntegrationCommand);
}
```

## 7. 設定とコンフィギュレーション

### package.json (contributes.configuration部分)
```json
{
  "contributes": {
    "configuration": {
      "title": "TestData Buddy",
      "properties": {
        "testdata-buddy.ai.apiKey": {
          "type": "string",
          "description": "Claude API キー（自然言語データ生成機能用）",
          "scope": "application"
        },
        "testdata-buddy.ai.model": {
          "type": "string",
          "default": "claude-3-sonnet-20240229",
          "description": "使用するClaude AIモデル"
        },
        "testdata-buddy.generation.locale": {
          "type": "string",
          "default": "ja",
          "enum": ["ja", "en"],
          "description": "データ生成ロケール"
        },
        "testdata-buddy.generation.defaultPasswordLength": {
          "type": "number",
          "default": 12,
          "minimum": 4,
          "maximum": 128,
          "description": "デフォルトパスワード長"
        },
        "testdata-buddy.storage.maxHistoryItems": {
          "type": "number",
          "default": 100,
          "description": "保存する履歴の最大数"
        }
      }
    }
  }
}
```

このVSCode/Cursor拡張機能実装により、以下の機能が提供されます：

- **コマンドパレット統合**: `Ctrl+Shift+P` でテストデータ生成コマンドにアクセス
- **サイドバー統合**: 生成履歴の表示と管理
- **キーボードショートカット**: 頻繁に使用する機能への素早いアクセス
- **設定統合**: VSCode設定画面からの設定変更
- **Webviewパネル**: リッチなUI体験
- **自然言語インターフェース**: Cursor AIとの統合
- **MCP実装**: Claude AIによる自然言語からの構造化パラメータ生成

これにより、開発者・QAエンジニアがVSCodeやCursorの統合開発環境内で効率的にテストデータを生成できるようになります。 