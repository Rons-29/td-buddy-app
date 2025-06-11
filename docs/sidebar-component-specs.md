# 🔧 サイドバーコンポーネント技術仕様書
## TestData Buddy - 実装詳細

---

## 📁 ファイル構成

### ディレクトリ構造
```
td-buddy-webapp/frontend/
├── components/
│   └── navigation/
│       ├── SidebarNavigation/
│       │   ├── index.tsx              # メインエクスポート
│       │   ├── Sidebar.tsx            # メインコンテナ
│       │   ├── AccordionMenu.tsx      # アコーディオン機能
│       │   ├── MenuItem.tsx           # 個別メニューアイテム
│       │   ├── SearchBar.tsx          # 検索機能
│       │   ├── FavoritesList.tsx      # お気に入り機能
│       │   ├── MobileToggle.tsx       # モバイル用トグル
│       │   └── types.ts               # 型定義
│       └── index.ts                   # まとめてエクスポート
└── hooks/
    ├── useSidebar.ts                  # サイドバー状態管理
    ├── useLocalStorage.ts             # ローカルストレージ
    └── useMediaQuery.ts               # レスポンシブ判定
```

---

## 🏗️ コンポーネント設計

### 1. メイン型定義 (types.ts)

```typescript
// メニューアイテムの型定義
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description?: string;
  badge?: string | number;
  isNew?: boolean;
  keywords?: string[];
}

// カテゴリの型定義
export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
  defaultExpanded?: boolean;
  color?: 'primary' | 'secondary' | 'accent';
}

// サイドバー状態の型定義
export interface SidebarState {
  isOpen: boolean;                     // モバイル時の開閉状態
  isCollapsed: boolean;                // デスクトップ時の収納状態
  expandedCategories: string[];        // 展開中のカテゴリID配列
  favorites: string[];                 // お気に入りメニューID配列
  searchQuery: string;                 // 検索クエリ
  recentlyUsed: string[];             // 最近使用した機能ID配列
}

// 設定の型定義
export interface SidebarConfig {
  categories: MenuCategory[];
  showSearch: boolean;
  showFavorites: boolean;
  showRecentlyUsed: boolean;
  maxRecentItems: number;
  persistState: boolean;
}
```

### 2. メインコンテナ (Sidebar.tsx)

```typescript
'use client';

import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import AccordionMenu from './AccordionMenu';
import SearchBar from './SearchBar';
import FavoritesList from './FavoritesList';
import MobileToggle from './MobileToggle';
import type { SidebarConfig } from './types';

interface SidebarProps {
  config: SidebarConfig;
  className?: string;
}

export default function Sidebar({ config, className = '' }: SidebarProps) {
  const { state, actions } = useSidebar(config);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  // モバイル時のオーバーレイクリック処理
  const handleOverlayClick = () => {
    if (isMobile && state.isOpen) {
      actions.closeSidebar();
    }
  };

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isMobile && state.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-td-primary-200 z-50
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-80' : state.isCollapsed ? 'w-16' : 'w-72'}
          ${isMobile ? (state.isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${className}
        `}
      >
        {/* ヘッダー部分 */}
        <div className="p-4 border-b border-td-primary-100">
          <div className="flex items-center justify-between">
            {!state.isCollapsed && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl td-heartbeat">🤖</span>
                <span className="font-bold text-td-primary-800">TD Buddy</span>
              </div>
            )}
            
            {/* デスクトップ用収納ボタン */}
            {!isMobile && (
              <button
                onClick={actions.toggleCollapse}
                className="p-1 rounded hover:bg-td-primary-100 transition-colors"
                title={state.isCollapsed ? '展開' : '収納'}
              >
                <span className="text-td-primary-600">
                  {state.isCollapsed ? '▶️' : '◀️'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 検索バー */}
        {config.showSearch && !state.isCollapsed && (
          <div className="p-3 border-b border-td-primary-100">
            <SearchBar
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="機能を検索..."
            />
          </div>
        )}

        {/* スクロール可能なメニュー領域 */}
        <div className="flex-1 overflow-y-auto">
          {/* お気に入り機能 */}
          {config.showFavorites && !state.isCollapsed && state.favorites.length > 0 && (
            <FavoritesList
              favorites={state.favorites}
              categories={config.categories}
              onRemoveFavorite={actions.removeFavorite}
            />
          )}

          {/* メインメニュー */}
          <AccordionMenu
            categories={config.categories}
            expandedCategories={state.expandedCategories}
            favorites={state.favorites}
            searchQuery={state.searchQuery}
            isCollapsed={state.isCollapsed}
            onToggleCategory={actions.toggleCategory}
            onAddFavorite={actions.addFavorite}
            onRemoveFavorite={actions.removeFavorite}
          />
        </div>

        {/* フッター部分 */}
        {!state.isCollapsed && (
          <div className="p-3 border-t border-td-primary-100">
            <div className="text-xs text-td-primary-500 text-center">
              TD Buddy v1.0.0
            </div>
          </div>
        )}
      </aside>

      {/* モバイル用トグルボタン */}
      {isMobile && (
        <MobileToggle
          isOpen={state.isOpen}
          onClick={actions.toggleSidebar}
        />
      )}
    </>
  );
}
```

### 3. アコーディオンメニュー (AccordionMenu.tsx)

```typescript
'use client';

import React from 'react';
import MenuItem from './MenuItem';
import type { MenuCategory } from './types';

interface AccordionMenuProps {
  categories: MenuCategory[];
  expandedCategories: string[];
  favorites: string[];
  searchQuery: string;
  isCollapsed: boolean;
  onToggleCategory: (categoryId: string) => void;
  onAddFavorite: (itemId: string) => void;
  onRemoveFavorite: (itemId: string) => void;
}

export default function AccordionMenu({
  categories,
  expandedCategories,
  favorites,
  searchQuery,
  isCollapsed,
  onToggleCategory,
  onAddFavorite,
  onRemoveFavorite,
}: AccordionMenuProps) {
  // 検索フィルタリング
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories;

    return categories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords?.some(keyword =>
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    })).filter(category => category.items.length > 0);
  }, [categories, searchQuery]);

  return (
    <nav className="p-2">
      {filteredCategories.map((category) => {
        const isExpanded = expandedCategories.includes(category.id);
        const hasSearchResults = searchQuery && category.items.length > 0;

        return (
          <div key={category.id} className="mb-2">
            {/* カテゴリヘッダー */}
            <button
              onClick={() => onToggleCategory(category.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg
                text-left font-medium transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                hover:bg-td-primary-50 group
              `}
              title={isCollapsed ? category.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg group-hover:animate-wiggle">
                  {category.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-td-primary-800">
                    {category.label}
                  </span>
                )}
              </div>
              
              {!isCollapsed && (
                <span className={`
                  text-td-primary-400 transition-transform duration-200
                  ${isExpanded ? 'rotate-90' : ''}
                `}>
                  ▶️
                </span>
              )}
            </button>

            {/* サブメニュー */}
            {(isExpanded || hasSearchResults || isCollapsed) && (
              <div className={`
                mt-1 space-y-1
                ${isCollapsed ? 'hidden' : ''}
                ${!isCollapsed && (isExpanded || hasSearchResults) ? 'animate-slide-down' : ''}
              `}>
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isFavorite={favorites.includes(item.id)}
                    isCollapsed={isCollapsed}
                    onAddFavorite={onAddFavorite}
                    onRemoveFavorite={onRemoveFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

---

## 🎨 CSS拡張 (globals.css 追加分)

```css
/* サイドバー専用アニメーション */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* アコーディオンホバー効果 */
.menu-category:hover .category-icon {
  animation: wiggle 0.5s ease-in-out;
}

/* グラデーション境界線 */
.sidebar-gradient-border::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #3B82F6, transparent);
}

/* コンパクト表示時のツールチップ */
.sidebar-tooltip {
  @apply absolute left-full ml-2 px-2 py-1 bg-td-primary-800 text-white text-sm rounded opacity-0 pointer-events-none transition-opacity duration-200;
}

.sidebar-item:hover .sidebar-tooltip {
  @apply opacity-100;
}

/* スクロールバー非表示（サイドバー内） */
.sidebar-scroll::-webkit-scrollbar {
  width: 3px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.2);
  border-radius: 3px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.4);
}
```

---

## 🔧 カスタムフック

### useSidebar.ts

```typescript
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { SidebarState, SidebarConfig } from '../components/navigation/SidebarNavigation/types';

const STORAGE_KEY = 'td-sidebar-state';

export function useSidebar(config: SidebarConfig) {
  // ローカルストレージから状態を復元
  const [storedState, setStoredState] = useLocalStorage<Partial<SidebarState>>(STORAGE_KEY, {});

  // 初期状態の設定
  const [state, setState] = useState<SidebarState>({
    isOpen: false,
    isCollapsed: false,
    expandedCategories: config.categories
      .filter(cat => cat.defaultExpanded)
      .map(cat => cat.id),
    favorites: [],
    searchQuery: '',
    recentlyUsed: [],
    ...storedState,
  });

  // 状態の永続化
  useEffect(() => {
    if (config.persistState) {
      setStoredState({
        expandedCategories: state.expandedCategories,
        favorites: state.favorites,
        isCollapsed: state.isCollapsed,
      });
    }
  }, [state.expandedCategories, state.favorites, state.isCollapsed, config.persistState, setStoredState]);

  // アクション定義
  const actions = {
    toggleSidebar: useCallback(() => {
      setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }, []),

    closeSidebar: useCallback(() => {
      setState(prev => ({ ...prev, isOpen: false }));
    }, []),

    toggleCollapse: useCallback(() => {
      setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
    }, []),

    toggleCategory: useCallback((categoryId: string) => {
      setState(prev => ({
        ...prev,
        expandedCategories: prev.expandedCategories.includes(categoryId)
          ? prev.expandedCategories.filter(id => id !== categoryId)
          : [...prev.expandedCategories, categoryId],
      }));
    }, []),

    addFavorite: useCallback((itemId: string) => {
      setState(prev => ({
        ...prev,
        favorites: [...prev.favorites, itemId],
      }));
    }, []),

    removeFavorite: useCallback((itemId: string) => {
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.filter(id => id !== itemId),
      }));
    }, []),

    setSearchQuery: useCallback((query: string) => {
      setState(prev => ({ ...prev, searchQuery: query }));
    }, []),

    addRecentlyUsed: useCallback((itemId: string) => {
      setState(prev => {
        const updated = [itemId, ...prev.recentlyUsed.filter(id => id !== itemId)]
          .slice(0, config.maxRecentItems);
        return { ...prev, recentlyUsed: updated };
      });
    }, [config.maxRecentItems]),
  };

  return { state, actions };
}
```

---

## 📊 設定ファイル例

### sidebar-config.ts

```typescript
import type { SidebarConfig } from './components/navigation/SidebarNavigation/types';

export const sidebarConfig: SidebarConfig = {
  showSearch: true,
  showFavorites: true,
  showRecentlyUsed: true,
  maxRecentItems: 5,
  persistState: true,
  categories: [
    {
      id: 'data-generation',
      label: 'データ生成',
      icon: '📊',
      defaultExpanded: true,
      color: 'primary',
      items: [
        {
          id: 'personal-info',
          label: '個人情報生成',
          icon: '👤',
          href: '/personal',
          description: 'テスト用の架空個人データを生成',
          keywords: ['個人', '名前', '住所', 'テストデータ'],
        },
        {
          id: 'password',
          label: 'パスワード生成',
          icon: '🔐',
          href: '/password',
          description: 'セキュアな強力パスワードを生成',
          keywords: ['パスワード', 'セキュリティ', '認証'],
        },
        // ... 他のアイテム
      ],
    },
    // ... 他のカテゴリ
  ],
};
```

---

**この仕様書により、拡張性と保守性を兼ね備えた高品質なサイドバーコンポーネントの実装が可能になります！** 🚀 