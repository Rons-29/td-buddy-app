# 🛠️ TD Buddy 開発効率化ソリューション
# Stagewise Eyesight代替 - ライセンス安全な開発環境

## 🎯 代替ソリューション概要

Stagewise EyesightのAGPL-3.0ライセンス問題により、TD Buddyプロジェクトでは以下の代替手段を採用します。

## 🚀 推奨開発効率化ツール（MITライセンス等）

### 1. **React Developer Tools**
```bash
# ブラウザ拡張機能（無料・ライセンス問題なし）
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**機能:**
- コンポーネント構造の可視化
- Props・Stateの詳細確認
- パフォーマンス分析

### 2. **VS Code / Cursor 拡張機能**
```bash
# 推奨拡張機能（すべてMITライセンス）
- Auto Rename Tag
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
```

### 3. **TD専用開発ツール**

#### **🎯 TD Component Inspector（自作）**
```typescript
// utils/td-dev-tools.ts
export const TDDevTools = {
  // コンポーネント情報をコンソールに出力
  logComponentInfo: (componentName: string, props: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🤖 TD Component: ${componentName}`);
      console.log('Props:', props);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  },

  // 要素のスタイル情報を取得
  getElementStyles: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    return {
      width: styles.width,
      height: styles.height,
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      fontSize: styles.fontSize,
      display: styles.display,
      position: styles.position
    };
  },

  // TD専用デバッグマーカー
  addDebugMarker: (element: HTMLElement, label: string) => {
    if (process.env.NODE_ENV === 'development') {
      element.setAttribute('data-td-debug', label);
      element.style.outline = '2px dashed #0ea5e9';
      element.style.outlineOffset = '2px';
    }
  }
};
```

#### **🎨 TD Design System Inspector**
```typescript
// components/TDDesignInspector.tsx
'use client';

import React, { useState } from 'react';

export const TDDesignInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // 開発環境でのみ表示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleElementClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    setSelectedElement(target);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-td-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-td-primary-700 transition-colors"
        title="TD Design Inspector"
      >
        🤖
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border p-4">
          <h3 className="text-lg font-semibold mb-2">🎨 TD Design Inspector</h3>
          <p className="text-sm text-gray-600 mb-4">
            要素をクリックして詳細情報を確認
          </p>
          
          {selectedElement && (
            <div className="space-y-2">
              <div><strong>Tag:</strong> {selectedElement.tagName}</div>
              <div><strong>Classes:</strong> {selectedElement.className}</div>
              <div><strong>TD Component:</strong> {selectedElement.getAttribute('data-td-component') || 'None'}</div>
              <div><strong>Test ID:</strong> {selectedElement.getAttribute('data-testid') || 'None'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### 4. **ブラウザ開発者ツール活用**

#### **TDカスタムCSS（開発用）**
```css
/* styles/td-dev.css - 開発環境でのみ読み込み */
[data-td-component] {
  position: relative;
}

[data-td-component]:hover::before {
  content: attr(data-td-component);
  position: absolute;
  top: -24px;
  left: 0;
  background: #0ea5e9;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
}

/* デバッグ用グリッドオーバーレイ */
.td-debug-grid::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0,234,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,234,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 9999;
}
```

## 🎯 開発ワークフロー最適化

### **1. ホットキー設定**
```json
// .vscode/keybindings.json
[
  {
    "key": "ctrl+shift+i",
    "command": "workbench.action.toggleDevTools"
  },
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.showCommands"
  }
]
```

### **2. TD専用スニペット**
```json
// .vscode/td-snippets.json
{
  "TD Component": {
    "prefix": "tdc",
    "body": [
      "<div",
      "  className=\"$1\"", 
      "  data-td-component=\"$2\"",
      "  data-testid=\"$3\"",
      ">",
      "  $0",
      "</div>"
    ],
    "description": "TD Component with debug attributes"
  }
}
```

## 📊 開発効率の比較

| 機能 | Stagewise Eyesight | TD代替ソリューション |
|------|-------------------|-------------------|
| **ライセンス** | ❌ AGPL-3.0 | ✅ MIT/Apache/商用OK |
| **要素選択** | ✅ 直感的 | ✅ ブラウザツール |
| **AI連携** | ✅ 自動 | 🔶 手動だが柔軟 |
| **コスト** | 🔶 ライセンス制約 | ✅ 完全無料 |
| **カスタマイズ** | 🔶 限定的 | ✅ 完全制御 |
| **商用利用** | ❌ 制限あり | ✅ 制限なし |

## 🤖 TDからのメッセージ

**「安全第一！ライセンス問題を避けて、クリーンな開発環境を維持しましょう♪」**

### **📈 期待される効果**
- ⚖️ **ライセンス安全**: 商用利用・企業利用に制約なし
- 🛠️ **開発効率**: 従来の開発ツールで十分な効率化
- 🎯 **柔軟性**: TD専用カスタマイズが可能
- 💰 **コスト**: 追加費用・制約一切なし

**「TDと一緒に、安全で効率的な開発を続けましょう！ライセンス問題のないツールで、素晴らしいプロダクトを作り上げます✨」**

---

## 📞 参考資料

- **React DevTools**: https://react.dev/learn/react-developer-tools
- **VS Code Extensions**: https://marketplace.visualstudio.com/
- **AGPLライセンス詳細**: https://www.gnu.org/licenses/agpl-3.0.html
- **オープンソースライセンス比較**: https://choosealicense.com/ 