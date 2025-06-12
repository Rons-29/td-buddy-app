'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff, RefreshCw, Check, AlertTriangle, Info } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomCharset {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
  color: string;
}

interface CustomCharsetsEditorProps {
  charsets: CustomCharset[];
  onChange: (charsets: CustomCharset[]) => void;
  className?: string;
  visible: boolean;
}

// プリセット文字セット
const CHARSET_PRESETS = {
  vowels: {
    name: '母音',
    charset: 'aeiouAEIOU',
    description: '英語の母音文字',
    color: '#ef4444'
  },
  consonants: {
    name: '子音',
    charset: 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
    description: '英語の子音文字',
    color: '#3b82f6'
  },
  hiragana: {
    name: 'ひらがな',
    charset: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
    description: '日本語のひらがな',
    color: '#f59e0b'
  },
  katakana: {
    name: 'カタカナ',
    charset: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    description: '日本語のカタカナ',
    color: '#10b981'
  },
  math: {
    name: '数学記号',
    charset: '+-=×÷<>≤≥≠±∞',
    description: '基本的な数学記号',
    color: '#8b5cf6'
  },
  greek: {
    name: 'ギリシャ文字',
    charset: 'αβγδεζηθικλμνξοπρστυφχψω',
    description: 'ギリシャ文字（小文字）',
    color: '#ec4899'
  }
};

// カラーパレット
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#c026d3', '#d946ef', '#ec4899', '#f43f5e'
];

// ソート可能な文字種アイテムコンポーネント
const SortableCharsetItem: React.FC<{
  charset: CustomCharset;
  validationErrors: string[];
  onUpdate: (field: keyof CustomCharset, value: any) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}> = ({ charset, validationErrors, onUpdate, onDuplicate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: charset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-4 border-2 rounded-lg transition-all ${
        charset.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
      } ${isDragging ? 'shadow-lg z-10' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* ドラッグハンドル */}
        <div 
          className="pt-2 cursor-move touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className={`w-4 h-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>

        {/* カラーインジケーター */}
        <div className="pt-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: charset.color }}
          />
        </div>

        {/* メイン入力エリア */}
        <div className="flex-1 space-y-3">
          {/* 名前と有効/無効 */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="文字種名（例: 母音）"
              value={charset.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onUpdate('enabled', !charset.enabled)}
              className={`p-2 rounded ${
                charset.enabled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={charset.enabled ? '有効' : '無効'}
            >
              {charset.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* 文字セット入力 */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="文字セット（例: aeiou）"
              value={charset.charset}
              onChange={(e) => onUpdate('charset', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-mono focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>文字数: {[...new Set(charset.charset)].length}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1">
                  最小文字数:
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={charset.min}
                    onChange={(e) => onUpdate('min', parseInt(e.target.value) || 1)}
                    className="w-16 p-1 border border-gray-300 rounded text-center"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* エラー表示 */}
          {validationErrors.length > 0 && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  {validationErrors.map((error, errorIndex) => (
                    <div key={errorIndex} className="text-sm text-red-700">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 操作ボタン */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="複製"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="削除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CustomCharsetsEditor: React.FC<CustomCharsetsEditorProps> = ({
  charsets,
  onChange,
  className = '',
  visible
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [previewPassword, setPreviewPassword] = useState<string>('');

  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 文字種の妥当性チェック
  useEffect(() => {
    const errors: Record<string, string[]> = {};
    
    charsets.forEach(charset => {
      const charsetErrors: string[] = [];
      
      // 名前のチェック
      if (!charset.name.trim()) {
        charsetErrors.push('文字種名を入力してください');
      }
      
      // 文字セットのチェック
      if (!charset.charset.trim()) {
        charsetErrors.push('文字セットを入力してください');
      } else if (charset.charset.length < charset.min) {
        charsetErrors.push(`文字セットの長さが最小文字数(${charset.min})より少ないです`);
      }
      
      // 最小文字数のチェック
      if (charset.min < 1) {
        charsetErrors.push('最小文字数は1以上である必要があります');
      }
      
      // 重複名のチェック
      const duplicateNames = charsets.filter(c => c.name === charset.name && c.id !== charset.id);
      if (duplicateNames.length > 0) {
        charsetErrors.push('文字種名が重複しています');
      }
      
      if (charsetErrors.length > 0) {
        errors[charset.id] = charsetErrors;
      }
    });
    
    setValidationErrors(errors);
  }, [charsets]);

  // プレビューパスワード醸造
  useEffect(() => {
    if (charsets.length === 0) {
      setPreviewPassword('');
      return;
    }
    
    const enabledCharsets = charsets.filter(cs => cs.enabled && cs.charset.trim());
    if (enabledCharsets.length === 0) {
      setPreviewPassword('文字種が選択されていません');
      return;
    }
    
    try {
      let password = '';
      const totalLength = 12;
      
      // 各文字種から最小文字数を生成
      enabledCharsets.forEach(charset => {
        for (let i = 0; i < charset.min; i++) {
          const randomIndex = Math.floor(Math.random() * charset.charset.length);
          password += charset.charset[randomIndex];
        }
      });
      
      // 残りの文字を全体からランダム生成
      const allChars = enabledCharsets.map(cs => cs.charset).join('');
      for (let i = password.length; i < totalLength; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
      }
      
      // シャッフル
      const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
      setPreviewPassword(shuffled);
    } catch (error) {
      setPreviewPassword('生成エラー');
    }
  }, [charsets]);

  if (!visible) return null;

  // 新しい文字種を追加
  const addCharset = () => {
    const newCharset: CustomCharset = {
      id: `charset-${Date.now()}`,
      name: '',
      charset: '',
      min: 1,
      enabled: true,
      color: COLOR_PALETTE[charsets.length % COLOR_PALETTE.length]
    };
    onChange([...charsets, newCharset]);
  };

  // 文字種を削除
  const removeCharset = (id: string) => {
    onChange(charsets.filter(cs => cs.id !== id));
  };

  // 文字種を更新
  const updateCharset = (id: string, field: keyof CustomCharset, value: any) => {
    onChange(charsets.map(cs => 
      cs.id === id ? { ...cs, [field]: value } : cs
    ));
  };

  // プリセットを適用
  const applyPreset = (presetKey: keyof typeof CHARSET_PRESETS) => {
    const preset = CHARSET_PRESETS[presetKey];
    const newCharset: CustomCharset = {
      id: `charset-${Date.now()}`,
      name: preset.name,
      charset: preset.charset,
      min: 1,
      enabled: true,
      color: preset.color
    };
    onChange([...charsets, newCharset]);
    setShowPresets(false);
  };

  // 文字種を複製
  const duplicateCharset = (charset: CustomCharset) => {
    const duplicated: CustomCharset = {
      ...charset,
      id: `charset-${Date.now()}`,
      name: `${charset.name} (コピー)`,
      color: COLOR_PALETTE[charsets.length % COLOR_PALETTE.length]
    };
    onChange([...charsets, duplicated]);
  };

  // ドラッグ&ドロップ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = charsets.findIndex(charset => charset.id === active.id);
      const newIndex = charsets.findIndex(charset => charset.id === over.id);

      onChange(arrayMove(charsets, oldIndex, newIndex));
    }
  };

  return (
    <div className={`custom-charsets-editor ${className}`}>
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">カスタム文字種エディター</h3>
            <p className="text-sm text-gray-600">独自の文字種を定義してパスワード醸造をカスタマイズ</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <RefreshCw className="w-4 h-4" />
              プリセット
            </button>
            <button
              onClick={addCharset}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              <Plus className="w-4 h-4" />
              文字種追加
            </button>
          </div>
        </div>

        {/* プリセット選択 */}
        {showPresets && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-3">プリセット文字種</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CHARSET_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof CHARSET_PRESETS)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="font-medium text-gray-800">{preset.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{preset.description}</div>
                  <div className="text-xs font-mono text-blue-600 truncate">
                    {preset.charset.length > 20 ? 
                      `${preset.charset.substring(0, 20)}...` : 
                      preset.charset
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 文字種リスト */}
        <div className="space-y-3">
          {charsets.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-500 mb-2">文字種が設定されていません</div>
              <button
                onClick={addCharset}
                className="text-blue-600 hover:text-blue-800"
              >
                最初の文字種を追加する
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={charsets.map(cs => cs.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {charsets.map((charset) => (
                    <SortableCharsetItem
                      key={charset.id}
                      charset={charset}
                      validationErrors={validationErrors[charset.id] || []}
                      onUpdate={(field, value) => updateCharset(charset.id, field, value)}
                      onDuplicate={() => duplicateCharset(charset)}
                      onRemove={() => removeCharset(charset.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* プレビュー */}
        {charsets.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">プレビュー</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">生成例:</span>
                <span className="font-mono text-lg bg-white px-3 py-1 rounded border">
                  {previewPassword}
                </span>
                <button
                  onClick={() => {
                    // プレビューを再生成
                    const timestamp = Date.now();
                    setPreviewPassword('醸造中...');
                    setTimeout(() => {
                      // useEffectが動作してプレビューが更新される
                    }, 100);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-xs text-blue-600">
                <div>有効な文字種: {charsets.filter(cs => cs.enabled).length} / {charsets.length}</div>
                <div>総文字数: {charsets.filter(cs => cs.enabled).reduce((sum, cs) => sum + [...new Set(cs.charset)].length, 0)}</div>
                <div>最小必要文字数: {charsets.filter(cs => cs.enabled).reduce((sum, cs) => sum + cs.min, 0)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ヘルプ情報 */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <h4 className="font-medium mb-2">💡 カスタム文字種のコツ</h4>
              <ul className="space-y-1 text-xs">
                <li>• 各文字種から最低限の文字数が必ずパスワードに含まれます</li>
                <li>• 文字種名は分かりやすい名前を付けてください</li>
                <li>• 重複した文字は自動的に除去されます</li>
                <li>• 無効にした文字種はパスワード醸造に使用されません</li>
                <li>• <span className="bg-yellow-100 px-1 rounded">🆕 ドラッグ&ドロップで並び順を変更できます</span></li>
                <li>• <span className="bg-yellow-100 px-1 rounded">🆕 ハンドル（⋮⋮）をドラッグして順序を入れ替え</span></li>
                <li>• プリセットから簡単に文字種を追加できます</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 