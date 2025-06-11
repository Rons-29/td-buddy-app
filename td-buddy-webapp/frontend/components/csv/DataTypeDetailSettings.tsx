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
import { SETTING_TOOLTIPS } from '../../types/csv-setting-tooltips';
import { Button } from '../ui/Button';
import { LabelWithTooltip } from '../ui/Tooltip';

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

  // 共通の入力フィールドコンポーネント（ツールチップ対応）
  const InputField = ({
    label,
    tooltip,
    type = 'text',
    value,
    onChange,
    required = false,
    ...props
  }: any) => (
    <div className="space-y-1">
      <LabelWithTooltip label={label} tooltip={tooltip} required={required} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );

  // 共通のセレクトコンポーネント（ツールチップ対応）
  const SelectField = ({
    label,
    tooltip,
    value,
    onChange,
    options,
    required = false,
    ...props
  }: any) => (
    <div className="space-y-1">
      <LabelWithTooltip label={label} tooltip={tooltip} required={required} />
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

  // 共通のチェックボックスコンポーネント（ツールチップ対応）
  const CheckboxField = ({ label, tooltip, checked, onChange }: any) => (
    <div className="flex items-center space-x-2">
      <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>{label}</span>
      </label>
      <LabelWithTooltip label="" tooltip={tooltip} />
    </div>
  );

  // 数値範囲設定コンポーネント（改善版・ツールチップ対応）
  const NumberRangeSettings = ({
    settings,
  }: {
    settings: RandomNumberSettings;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      <InputField
        label="最小値"
        tooltip={SETTING_TOOLTIPS.numberRange.min}
        type="number"
        value={settings.min}
        onChange={(e: any) =>
          updateSetting('min', parseInt(e.target.value) || 0)
        }
        required
      />
      <InputField
        label="最大値"
        tooltip={SETTING_TOOLTIPS.numberRange.max}
        type="number"
        value={settings.max}
        onChange={(e: any) =>
          updateSetting('max', parseInt(e.target.value) || 100)
        }
        required
      />
      <div className="col-span-2 flex items-center justify-between">
        <CheckboxField
          label="整数のみ"
          tooltip={SETTING_TOOLTIPS.numberRange.isInteger}
          checked={settings.isInteger}
          onChange={(e: any) => updateSetting('isInteger', e.target.checked)}
        />
        {!settings.isInteger && (
          <div className="w-20">
            <InputField
              label="小数桁"
              tooltip={SETTING_TOOLTIPS.numberRange.decimals}
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

  // テキスト設定コンポーネント（改善版・ツールチップ対応）
  const TextSettingsComponent = ({ settings }: { settings: TextSettings }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="最小単語数"
          tooltip={SETTING_TOOLTIPS.text.minWords}
          type="number"
          min="1"
          value={settings.minWords}
          onChange={(e: any) =>
            updateSetting('minWords', parseInt(e.target.value) || 1)
          }
          required
        />
        <InputField
          label="最大単語数"
          tooltip={SETTING_TOOLTIPS.text.maxWords}
          type="number"
          min="1"
          value={settings.maxWords}
          onChange={(e: any) =>
            updateSetting('maxWords', parseInt(e.target.value) || 5)
          }
          required
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SelectField
            label="言語"
            tooltip={SETTING_TOOLTIPS.text.language}
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
            tooltip={SETTING_TOOLTIPS.text.includeEmoji}
            checked={settings.includeEmoji}
            onChange={(e: any) =>
              updateSetting('includeEmoji', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 電話番号設定コンポーネント（改善版・ツールチップ対応）
  const PhoneSettingsComponent = ({
    settings,
  }: {
    settings: PhoneNumberSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="形式"
          tooltip={SETTING_TOOLTIPS.phone.format}
          value={settings.format}
          onChange={(e: any) => updateSetting('format', e.target.value)}
          options={[
            { value: 'mobile', label: '携帯電話' },
            { value: 'landline', label: '固定電話' },
            { value: 'toll-free', label: 'フリーダイヤル' },
          ]}
        />
        <div className="flex items-center space-x-2 pt-5">
          <CheckboxField
            label="ハイフン付き"
            tooltip={SETTING_TOOLTIPS.phone.includeHyphen}
            checked={settings.includeHyphen}
            onChange={(e: any) =>
              updateSetting('includeHyphen', e.target.checked)
            }
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="pt-5">
          <CheckboxField
            label="数字を含める"
            tooltip={SETTING_TOOLTIPS.phone.includeNumbers}
            checked={settings.includeNumbers}
            onChange={(e: any) =>
              updateSetting('includeNumbers', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // メール設定コンポーネント（改善版・ツールチップ対応）
  const EmailSettingsComponent = ({
    settings,
  }: {
    settings: EmailSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="ドメイン"
          tooltip={SETTING_TOOLTIPS.email.domain}
          value={settings.domain}
          onChange={(e: any) => updateSetting('domain', e.target.value)}
          placeholder="example.com"
        />
        <SelectField
          label="形式"
          tooltip={SETTING_TOOLTIPS.email.format}
          value={settings.format}
          onChange={(e: any) => updateSetting('format', e.target.value)}
          options={[
            { value: 'business', label: 'ビジネス用' },
            { value: 'personal', label: '個人用' },
            { value: 'random', label: 'ランダム' },
          ]}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="pt-5">
          <CheckboxField
            label="数字を含める"
            tooltip={SETTING_TOOLTIPS.email.includeNumbers}
            checked={settings.includeNumbers}
            onChange={(e: any) =>
              updateSetting('includeNumbers', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 日時設定コンポーネント（改善版・ツールチップ対応）
  const DateTimeSettingsComponent = ({
    settings,
  }: {
    settings: DateTimeSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="開始日"
          tooltip={SETTING_TOOLTIPS.dateTime.startDate}
          type="date"
          value={settings.startDate}
          onChange={(e: any) => updateSetting('startDate', e.target.value)}
          required
        />
        <InputField
          label="終了日"
          tooltip={SETTING_TOOLTIPS.dateTime.endDate}
          type="date"
          value={settings.endDate}
          onChange={(e: any) => updateSetting('endDate', e.target.value)}
          required
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SelectField
            label="フォーマット"
            tooltip={SETTING_TOOLTIPS.dateTime.format}
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
            tooltip={SETTING_TOOLTIPS.dateTime.includeTime}
            checked={settings.includeTime}
            onChange={(e: any) =>
              updateSetting('includeTime', e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // 連番設定コンポーネント（改善版・ツールチップ対応）
  const AutoIncrementSettingsComponent = ({
    settings,
  }: {
    settings: AutoIncrementSettings;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <InputField
          label="開始値"
          tooltip={SETTING_TOOLTIPS.autoIncrement.start}
          type="number"
          value={settings.start}
          onChange={(e: any) =>
            updateSetting('start', parseInt(e.target.value) || 1)
          }
          required
        />
        <InputField
          label="増分"
          tooltip={SETTING_TOOLTIPS.autoIncrement.step}
          type="number"
          min="1"
          value={settings.step}
          onChange={(e: any) =>
            updateSetting('step', parseInt(e.target.value) || 1)
          }
          required
        />
        <InputField
          label="ゼロパディング"
          tooltip={SETTING_TOOLTIPS.autoIncrement.padding}
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
          tooltip={SETTING_TOOLTIPS.autoIncrement.prefix}
          value={settings.prefix}
          onChange={(e: any) => updateSetting('prefix', e.target.value)}
          placeholder="USER"
        />
        <InputField
          label="サフィックス"
          tooltip={SETTING_TOOLTIPS.autoIncrement.suffix}
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
                💡 TDからのTip:
                設定項目のインフォマーク（ℹ️）にホバーすると詳しい説明が表示されます
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
