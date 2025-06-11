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
import {
  CompactCheckbox,
  CompactDivider,
  CompactInput,
  CompactLayout,
  CompactPanel,
  CompactRow,
  CompactSelect,
} from '../ui/CompactForm';

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
  // 設定更新ヘルパー
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  // 数値範囲設定コンポーネント（コンパクト版）
  const NumberRangeSettings = ({
    settings,
  }: {
    settings: RandomNumberSettings;
  }) => (
    <CompactLayout type="grid-3">
      <CompactInput
        label="最小値"
        tooltip={SETTING_TOOLTIPS.numberRange.min}
        tooltipPosition="top"
        type="number"
        value={settings.min}
        onChange={(e: any) =>
          updateSetting('min', parseInt(e.target.value) || 0)
        }
        required
      />
      <CompactInput
        label="最大値"
        tooltip={SETTING_TOOLTIPS.numberRange.max}
        tooltipPosition="top"
        type="number"
        value={settings.max}
        onChange={(e: any) =>
          updateSetting('max', parseInt(e.target.value) || 100)
        }
        required
      />
      <CompactRow>
        <CompactCheckbox
          label="整数のみ"
          tooltip={SETTING_TOOLTIPS.numberRange.isInteger}
          tooltipPosition="bottom"
          checked={settings.isInteger}
          onChange={(e: any) => updateSetting('isInteger', e.target.checked)}
        />
        {!settings.isInteger && (
          <CompactInput
            label="小数桁"
            tooltip={SETTING_TOOLTIPS.numberRange.decimals}
            tooltipPosition="bottom"
            type="number"
            min="0"
            max="10"
            value={settings.decimals || 2}
            onChange={(e: any) =>
              updateSetting('decimals', parseInt(e.target.value) || 2)
            }
            className="w-20"
          />
        )}
      </CompactRow>
    </CompactLayout>
  );

  // テキスト設定コンポーネント（コンパクト版）
  const TextSettingsComponent = ({ settings }: { settings: TextSettings }) => (
    <CompactLayout type="grid-3">
      <CompactInput
        label="最小単語数"
        tooltip={SETTING_TOOLTIPS.text.minWords}
        tooltipPosition="top"
        type="number"
        min="1"
        value={settings.minWords}
        onChange={(e: any) =>
          updateSetting('minWords', parseInt(e.target.value) || 1)
        }
        required
      />
      <CompactInput
        label="最大単語数"
        tooltip={SETTING_TOOLTIPS.text.maxWords}
        tooltipPosition="top"
        type="number"
        min="1"
        value={settings.maxWords}
        onChange={(e: any) =>
          updateSetting('maxWords', parseInt(e.target.value) || 5)
        }
        required
      />
      <CompactSelect
        label="言語"
        tooltip={SETTING_TOOLTIPS.text.language}
        tooltipPosition="top"
        value={settings.language}
        onChange={(e: any) => updateSetting('language', e.target.value)}
        options={[
          { value: 'ja', label: '日本語' },
          { value: 'en', label: '英語' },
          { value: 'mixed', label: '混合' },
        ]}
      />
      <CompactCheckbox
        label="絵文字含む"
        tooltip={SETTING_TOOLTIPS.text.includeEmoji}
        tooltipPosition="bottom"
        checked={settings.includeEmoji}
        onChange={(e: any) => updateSetting('includeEmoji', e.target.checked)}
      />
    </CompactLayout>
  );

  // 電話番号設定コンポーネント（コンパクト版）
  const PhoneSettingsComponent = ({
    settings,
  }: {
    settings: PhoneNumberSettings;
  }) => (
    <CompactLayout type="grid-2">
      <CompactSelect
        label="形式"
        tooltip={SETTING_TOOLTIPS.phone.format}
        tooltipPosition="top"
        value={settings.format}
        onChange={(e: any) => updateSetting('format', e.target.value)}
        options={[
          { value: 'mobile', label: '携帯電話' },
          { value: 'landline', label: '固定電話' },
          { value: 'toll-free', label: 'フリーダイヤル' },
        ]}
      />
      <div className="space-y-2">
        <CompactCheckbox
          label="ハイフン付き"
          tooltip={SETTING_TOOLTIPS.phone.includeHyphen}
          tooltipPosition="bottom"
          checked={settings.includeHyphen}
          onChange={(e: any) =>
            updateSetting('includeHyphen', e.target.checked)
          }
        />
        <CompactCheckbox
          label="数字を含める"
          tooltip={SETTING_TOOLTIPS.phone.includeNumbers}
          tooltipPosition="bottom"
          checked={settings.includeNumbers}
          onChange={(e: any) =>
            updateSetting('includeNumbers', e.target.checked)
          }
        />
      </div>
    </CompactLayout>
  );

  // メール設定コンポーネント（コンパクト版）
  const EmailSettingsComponent = ({
    settings,
  }: {
    settings: EmailSettings;
  }) => (
    <CompactLayout type="grid-2">
      <CompactSelect
        label="ドメイン"
        tooltip={SETTING_TOOLTIPS.email.domain}
        tooltipPosition="top"
        value={settings.domain}
        onChange={(e: any) => updateSetting('domain', e.target.value)}
        options={[
          { value: 'example.com', label: 'example.com' },
          { value: 'test.jp', label: 'test.jp' },
          { value: 'sample.org', label: 'sample.org' },
          { value: 'demo.net', label: 'demo.net' },
        ]}
      />
      <div className="space-y-2">
        <CompactSelect
          label="形式"
          tooltip={SETTING_TOOLTIPS.email.format}
          tooltipPosition="bottom"
          value={settings.format}
          onChange={(e: any) => updateSetting('format', e.target.value)}
          options={[
            { value: 'business', label: 'ビジネス用' },
            { value: 'personal', label: '個人用' },
            { value: 'random', label: 'ランダム' },
          ]}
        />
        <CompactCheckbox
          label="数字を含める"
          tooltip={SETTING_TOOLTIPS.email.includeNumbers}
          tooltipPosition="bottom"
          checked={settings.includeNumbers}
          onChange={(e: any) =>
            updateSetting('includeNumbers', e.target.checked)
          }
        />
      </div>
    </CompactLayout>
  );

  // 日付・時刻設定コンポーネント（コンパクト版）
  const DateTimeSettingsComponent = ({
    settings,
  }: {
    settings: DateTimeSettings;
  }) => (
    <CompactLayout type="grid-3">
      <CompactInput
        label="開始日"
        tooltip={SETTING_TOOLTIPS.dateTime.startDate}
        tooltipPosition="top"
        type="date"
        value={settings.startDate}
        onChange={(e: any) => updateSetting('startDate', e.target.value)}
        required
      />
      <CompactInput
        label="終了日"
        tooltip={SETTING_TOOLTIPS.dateTime.endDate}
        tooltipPosition="top"
        type="date"
        value={settings.endDate}
        onChange={(e: any) => updateSetting('endDate', e.target.value)}
        required
      />
      <CompactSelect
        label="フォーマット"
        tooltip={SETTING_TOOLTIPS.dateTime.format}
        tooltipPosition="top"
        value={settings.format}
        onChange={(e: any) => updateSetting('format', e.target.value)}
        options={[
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        ]}
      />
      <CompactCheckbox
        label="時刻含む"
        tooltip={SETTING_TOOLTIPS.dateTime.includeTime}
        tooltipPosition="bottom"
        checked={settings.includeTime}
        onChange={(e: any) => updateSetting('includeTime', e.target.checked)}
      />
    </CompactLayout>
  );

  // 連番設定コンポーネント（コンパクト版）
  const AutoIncrementSettingsComponent = ({
    settings,
  }: {
    settings: AutoIncrementSettings;
  }) => (
    <CompactLayout type="grid-3">
      <CompactInput
        label="開始値"
        tooltip={SETTING_TOOLTIPS.autoIncrement.start}
        tooltipPosition="top"
        type="number"
        value={settings.start}
        onChange={(e: any) =>
          updateSetting('start', parseInt(e.target.value) || 1)
        }
        required
      />
      <CompactInput
        label="増分"
        tooltip={SETTING_TOOLTIPS.autoIncrement.step}
        tooltipPosition="top"
        type="number"
        min="1"
        value={settings.step}
        onChange={(e: any) =>
          updateSetting('step', parseInt(e.target.value) || 1)
        }
        required
      />
      <CompactInput
        label="ゼロパディング"
        tooltip={SETTING_TOOLTIPS.autoIncrement.padding}
        tooltipPosition="top"
        type="number"
        min="0"
        max="10"
        value={settings.padding}
        onChange={(e: any) =>
          updateSetting('padding', parseInt(e.target.value) || 0)
        }
      />
      <CompactDivider />
      <CompactInput
        label="プレフィックス"
        tooltip={SETTING_TOOLTIPS.autoIncrement.prefix}
        tooltipPosition="bottom"
        value={settings.prefix || ''}
        onChange={(e: any) => updateSetting('prefix', e.target.value)}
        placeholder="USER"
      />
      <CompactInput
        label="サフィックス"
        tooltip={SETTING_TOOLTIPS.autoIncrement.suffix}
        tooltipPosition="bottom"
        value={settings.suffix || ''}
        onChange={(e: any) => updateSetting('suffix', e.target.value)}
        placeholder="_ID"
      />
    </CompactLayout>
  );

  // 設定コンポーネントの決定
  const renderSettingsComponent = () => {
    // デフォルト設定のキー名マッピング
    const settingsKey = (() => {
      switch (dataType) {
        case 'date':
        case 'time':
          return 'dateTime';
        default:
          return dataType;
      }
    })();

    const currentSettings = {
      ...DEFAULT_SETTINGS[settingsKey as keyof typeof DEFAULT_SETTINGS],
      ...settings,
    };

    switch (dataType) {
      case 'randomNumber':
        return (
          <NumberRangeSettings
            settings={currentSettings as RandomNumberSettings}
          />
        );
      case 'text':
      case 'words':
      case 'sentences':
      case 'paragraphs':
        return (
          <TextSettingsComponent settings={currentSettings as TextSettings} />
        );
      case 'phoneNumber':
        return (
          <PhoneSettingsComponent
            settings={currentSettings as PhoneNumberSettings}
          />
        );
      case 'email':
        return (
          <EmailSettingsComponent settings={currentSettings as EmailSettings} />
        );
      case 'dateTime':
      case 'date':
      case 'time':
        return (
          <DateTimeSettingsComponent
            settings={currentSettings as DateTimeSettings}
          />
        );
      case 'autoIncrement':
        return (
          <AutoIncrementSettingsComponent
            settings={currentSettings as AutoIncrementSettings}
          />
        );
      default:
        return (
          <div className="text-sm text-td-gray-500 text-center py-4">
            📝 このデータタイプの詳細設定はまだ用意されていません
            <div className="text-xs text-td-gray-400 mt-1">
              データタイプ: {dataType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="td-slide-down">
      {/* 詳細設定トグルボタン */}
      <Button
        onClick={onToggleExpanded}
        variant="ghost"
        size="sm"
        className="mt-2 w-full text-xs td-button border-td-primary-200 hover:bg-td-primary-50"
      >
        <Settings className="w-3 h-3 mr-1" />
        詳細設定
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 ml-1" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-1" />
        )}
      </Button>

      {/* 詳細設定パネル */}
      <div
        className={`overflow-visible transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        {isExpanded && (
          <CompactPanel
            showTip={true}
            tipText="設定項目のインフォマーク（ℹ️）にホバーすると詳しい説明が表示されます"
          >
            {renderSettingsComponent()}
          </CompactPanel>
        )}
      </div>
    </div>
  );
};
