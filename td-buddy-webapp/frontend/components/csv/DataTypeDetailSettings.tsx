'use client';

import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import React from 'react';
import {
  AutoIncrementSettings,
  DateTimeSettings,
  DEFAULT_SETTINGS,
  EmailSettings,
  PhoneNumberSettings,
  RandomNumberSettings,
  TextSettings,
} from '../../types/csv-detailed-settings';
import { Button } from '../ui/Button';

interface DataTypeDetailSettingsProps {
  dataType: string;
  settings: any;
  onSettingsChange: (settings: any) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const DataTypeDetailSettings: React.FC<DataTypeDetailSettingsProps> = ({
  dataType,
  settings,
  onSettingsChange,
  isExpanded,
  onToggleExpanded,
}) => {
  // 設定値を更新する共通関数
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  // 共通の入力フィールドコンポーネント
  const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
    ...props
  }: any) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );

  // 共通のセレクトコンポーネント
  const SelectField = ({ label, value, onChange, options, ...props }: any) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
        {...props}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // 共通のチェックボックスコンポーネント
  const CheckboxField = ({ label, checked, onChange }: any) => (
    <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );

  // 数値範囲設定コンポーネント（改善版）
  const NumberRangeSettings = ({
    settings,
  }: {
    settings: RandomNumberSettings;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      <InputField
        label="最小値"
        type="number"
        value={settings.min}
        onChange={(e: any) =>
          updateSetting('min', parseInt(e.target.value) || 0)
        }
      />
      <InputField
        label="最大値"
        type="number"
        value={settings.max}
        onChange={(e: any) =>
          updateSetting('max', parseInt(e.target.value) || 100)
        }
      />
      <div className="col-span-2 flex items-center justify-between">
        <CheckboxField
          label="整数のみ"
          checked={settings.isInteger}
          onChange={(e: any) => updateSetting('isInteger', e.target.checked)}
        />
        {!settings.isInteger && (
          <div className="w-20">
            <InputField
              label="小数桁"
              type="number"
              min="0"
              max="10"
              value={settings.decimals || 2}
              onChange={(e: any) =>
                updateSetting('decimals', parseInt(e.target.value) || 2)
              }
            />
          </div>
        )}
      </div>
    </div>
  );

  // テキスト設定コンポーネント（改善版）
  const TextSettingsComponent = ({ settings }: { settings: TextSettings }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="最小単語数"
          type="number"
          min="1"
          value={settings.minWords}
          onChange={(e: any) =>
            updateSetting('minWords', parseInt(e.target.value) || 1)
          }
        />
        <InputField
          label="最大単語数"
          type="number"
          min="1"
          value={settings.maxWords}
          onChange={(e: any) =>
            updateSetting('maxWords', parseInt(e.target.value) || 5)
          }
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SelectField
            label="言語"
            value={settings.language}
            onChange={(e: any) => updateSetting('language', e.target.value)}
            options={[
              { value: 'ja', label: '日本語' },
              { value: 'en', label: '英語' },
              { value: 'mixed', label: '混合' },
            ]}
          />
        </div>
        <div className="pt-5">
          <CheckboxField
            label="絵文字含む"
            checked={settings.includeEmoji}
            onChange={(e: any) =>
              updateSetting('includeEmoji', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 電話番号設定コンポーネント（改善版）
  const PhoneSettingsComponent = ({
    settings,
  }: {
    settings: PhoneNumberSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="形式"
          value={settings.format}
          onChange={(e: any) => updateSetting('format', e.target.value)}
          options={[
            { value: 'mobile', label: '携帯電話' },
            { value: 'landline', label: '固定電話' },
            { value: 'both', label: '両方' },
          ]}
        />
        <div className="pt-5">
          <CheckboxField
            label="ハイフン付き"
            checked={settings.hyphenated}
            onChange={(e: any) => updateSetting('hyphenated', e.target.checked)}
          />
        </div>
      </div>
      <InputField
        label="プレフィックス（カンマ区切り）"
        value={settings.prefix.join(', ')}
        onChange={(e: any) =>
          updateSetting(
            'prefix',
            e.target.value.split(',').map((s: string) => s.trim())
          )
        }
        placeholder="090, 080, 070"
      />
    </div>
  );

  // メール設定コンポーネント（改善版）
  const EmailSettingsComponent = ({
    settings,
  }: {
    settings: EmailSettings;
  }) => (
    <div className="space-y-2">
      <InputField
        label="ドメイン（カンマ区切り）"
        value={settings.domains.join(', ')}
        onChange={(e: any) =>
          updateSetting(
            'domains',
            e.target.value.split(',').map((s: string) => s.trim())
          )
        }
        placeholder="example.com, test.co.jp, demo.org"
      />
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="名前部分最大文字数"
          type="number"
          min="3"
          max="20"
          value={settings.maxNameLength}
          onChange={(e: any) =>
            updateSetting('maxNameLength', parseInt(e.target.value) || 10)
          }
        />
        <div className="pt-5">
          <CheckboxField
            label="数字を含める"
            checked={settings.includeNumbers}
            onChange={(e: any) =>
              updateSetting('includeNumbers', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 日時設定コンポーネント（改善版）
  const DateTimeSettingsComponent = ({
    settings,
  }: {
    settings: DateTimeSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="開始日"
          type="date"
          value={settings.startDate}
          onChange={(e: any) => updateSetting('startDate', e.target.value)}
        />
        <InputField
          label="終了日"
          type="date"
          value={settings.endDate}
          onChange={(e: any) => updateSetting('endDate', e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SelectField
            label="フォーマット"
            value={settings.format}
            onChange={(e: any) => updateSetting('format', e.target.value)}
            options={[
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            ]}
          />
        </div>
        <div className="pt-5">
          <CheckboxField
            label="時刻含む"
            checked={settings.includeTime}
            onChange={(e: any) =>
              updateSetting('includeTime', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 連番設定コンポーネント（改善版）
  const AutoIncrementSettingsComponent = ({
    settings,
  }: {
    settings: AutoIncrementSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <InputField
          label="開始値"
          type="number"
          value={settings.start}
          onChange={(e: any) =>
            updateSetting('start', parseInt(e.target.value) || 1)
          }
        />
        <InputField
          label="増分"
          type="number"
          min="1"
          value={settings.step}
          onChange={(e: any) =>
            updateSetting('step', parseInt(e.target.value) || 1)
          }
        />
        <InputField
          label="ゼロパディング"
          type="number"
          min="0"
          max="10"
          value={settings.padding}
          onChange={(e: any) =>
            updateSetting('padding', parseInt(e.target.value) || 0)
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="プレフィックス"
          value={settings.prefix}
          onChange={(e: any) => updateSetting('prefix', e.target.value)}
          placeholder="USER"
        />
        <InputField
          label="サフィックス"
          value={settings.suffix}
          onChange={(e: any) => updateSetting('suffix', e.target.value)}
          placeholder="_ID"
        />
      </div>
    </div>
  );

  const renderSettingsComponent = () => {
    const currentSettings = settings || DEFAULT_SETTINGS[dataType] || {};

    switch (dataType) {
      case 'randomNumber':
        return <NumberRangeSettings settings={currentSettings} />;
      case 'words':
      case 'sentences':
      case 'paragraphs':
        return <TextSettingsComponent settings={currentSettings} />;
      case 'phoneNumber':
        return <PhoneSettingsComponent settings={currentSettings} />;
      case 'email':
        return <EmailSettingsComponent settings={currentSettings} />;
      case 'dateTime':
      case 'date':
        return <DateTimeSettingsComponent settings={currentSettings} />;
      case 'autoIncrement':
        return <AutoIncrementSettingsComponent settings={currentSettings} />;
      default:
        return null;
    }
  };

  const hasSettings = [
    'randomNumber',
    'words',
    'sentences',
    'paragraphs',
    'phoneNumber',
    'email',
    'dateTime',
    'date',
    'autoIncrement',
  ].includes(dataType);

  if (!hasSettings) {
    return (
      <div className="text-xs text-gray-500 italic pl-2">
        💡 このデータタイプには詳細設定はありません
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onToggleExpanded();
        }}
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 p-1 h-auto"
      >
        <Settings className="w-3 h-3" />
        <span>詳細設定</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {isExpanded && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="space-y-2">{renderSettingsComponent()}</div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 TDからのTip: 設定を変更すると、データ生成時に反映されます
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
