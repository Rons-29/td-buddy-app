'use client';

import { Code, Eye, EyeOff, Grid } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ElementInfo {
  tagName: string;
  className: string;
  tdComponent: string | null;
  testId: string | null;
  styles: {
    width: string;
    height: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    display: string;
    position: string;
  };
}

export const TDDesignInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [elementInfo, setElementInfo] = useState<ElementInfo | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );

  // 要素クリックハンドラー
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!isInspectMode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const target = event.target as HTMLElement;
      if (target.closest('.td-inspector')) {
        return;
      } // インスペクター自体は除外

      setSelectedElement(target);

      // 要素情報を取得
      const styles = window.getComputedStyle(target);
      setElementInfo({
        tagName: target.tagName.toLowerCase(),
        className: target.className,
        tdComponent: target.getAttribute('data-td-component'),
        testId: target.getAttribute('data-testid'),
        styles: {
          width: styles.width,
          height: styles.height,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          display: styles.display,
          position: styles.position,
        },
      });

      // 視覚的フィードバック
      target.style.outline = '3px solid #0ea5e9';
      target.style.outlineOffset = '2px';

      setTimeout(() => {
        target.style.outline = '';
        target.style.outlineOffset = '';
      }, 2000);
    };

    const handleMouseOver = (event: MouseEvent) => {
      if (!isInspectMode) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.closest('.td-inspector')) {
        return;
      }

      target.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
      target.style.cursor = 'crosshair';
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!isInspectMode) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.closest('.td-inspector')) {
        return;
      }

      target.style.backgroundColor = '';
      target.style.cursor = '';
    };

    if (isInspectMode) {
      document.addEventListener('click', handleClick, true);
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isInspectMode]);

  // グリッドオーバーレイ
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    if (showGrid) {
      document.body.classList.add('td-debug-grid');
    } else {
      document.body.classList.remove('td-debug-grid');
    }

    return () => {
      document.body.classList.remove('td-debug-grid');
    };
  }, [showGrid]);

  const copyElementInfo = () => {
    if (!elementInfo) {
      return;
    }

    const info = `
TD Element Info:
- Tag: ${elementInfo.tagName}
- Classes: ${elementInfo.className}
- TD Component: ${elementInfo.tdComponent || 'None'}
- Test ID: ${elementInfo.testId || 'None'}
- Styles: ${JSON.stringify(elementInfo.styles, null, 2)}
    `.trim();

    navigator.clipboard.writeText(info);
    alert('要素情報をクリップボードにコピーしました！');
  };

  // 開発環境でない場合は何も表示しない
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* グリッドオーバーレイ用CSS */}
      <style jsx global>{`
        .td-debug-grid::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(
              rgba(14, 165, 233, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 9998;
        }

        .td-inspect-cursor * {
          cursor: crosshair !important;
        }
      `}</style>

      <div
        className={`td-inspector fixed bottom-4 right-4 z-50 ${
          isInspectMode ? 'td-inspect-cursor' : ''
        }`}
      >
        {/* メインボタン */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-td-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-td-primary-700 transition-all transform hover:scale-105"
          title="TD Design Inspector"
        >
          🤖
        </button>

        {/* インスペクターパネル */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border-2 border-td-primary-200 p-4 max-h-96 overflow-y-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-td-primary-800">
                🎨 TD Design Inspector
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded transition-colors ${
                    showGrid
                      ? 'bg-td-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  title="グリッド表示"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsInspectMode(!isInspectMode)}
                  className={`p-2 rounded transition-colors ${
                    isInspectMode
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  title="検査モード"
                >
                  {isInspectMode ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 説明 */}
            <div className="bg-td-primary-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-td-primary-700">
                {isInspectMode
                  ? '🎯 検査モード有効: 要素をクリックして詳細情報を確認'
                  : '👆 検査モードを有効にして要素を選択してください'}
              </p>
            </div>

            {/* 要素情報 */}
            {elementInfo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">
                    選択された要素
                  </h4>
                  <button
                    onClick={copyElementInfo}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Code className="w-3 h-3 inline mr-1" />
                    コピー
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>タグ:</strong> {elementInfo.tagName}
                  </div>
                  <div>
                    <strong>表示:</strong> {elementInfo.styles.display}
                  </div>
                  <div className="col-span-2">
                    <strong>クラス:</strong>
                    <div className="text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                      {elementInfo.className || 'なし'}
                    </div>
                  </div>
                  <div>
                    <strong>TD Component:</strong>
                    <span
                      className={`ml-1 px-2 py-1 rounded text-xs ${
                        elementInfo.tdComponent
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {elementInfo.tdComponent || 'なし'}
                    </span>
                  </div>
                  <div>
                    <strong>Test ID:</strong>
                    <span
                      className={`ml-1 px-2 py-1 rounded text-xs ${
                        elementInfo.testId
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {elementInfo.testId || 'なし'}
                    </span>
                  </div>
                </div>

                {/* スタイル情報 */}
                <div>
                  <strong className="block mb-2">計算済みスタイル:</strong>
                  <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                    <div>
                      サイズ: {elementInfo.styles.width} ×{' '}
                      {elementInfo.styles.height}
                    </div>
                    <div>フォント: {elementInfo.styles.fontSize}</div>
                    <div>背景色: {elementInfo.styles.backgroundColor}</div>
                    <div>文字色: {elementInfo.styles.color}</div>
                    <div>位置: {elementInfo.styles.position}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TDからのメッセージ */}
            <div className="mt-4 p-3 bg-td-secondary-50 rounded-lg">
              <p className="text-sm text-td-secondary-700">
                💡 <strong>TDのヒント:</strong> TD Design Systemの要素には{' '}
                <code>data-td-component</code>{' '}
                属性を追加すると、より詳細な情報が表示されます！
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
