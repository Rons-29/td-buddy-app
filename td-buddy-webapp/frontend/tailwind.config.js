/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 TDブランドカラー（統一版 v2.0）
        'td-primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3B82F6', // 🔵 メインブランドカラー（統一）
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'td-secondary': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10B981', // 🟢 サクセス・グリーン（統一）
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        'td-accent': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8B5CF6', // 🟣 AI・パープル（統一）
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },

        // 🛠️ ワークベンチカラーパレット統合
        // 作業台ウッド系（メインカラー）
        'wb-wood': {
          50: '#efebe9',
          100: '#d7ccc8',
          200: '#bcaaa4',
          300: '#a1887f',
          400: '#8d6e63', // メイン木材
          500: '#795548',
          600: '#6d4c41',
          700: '#5d4037',
          800: '#4e342e',
          900: '#3e2723',
        },

        // 金属工具系（セカンダリ）
        'wb-metal': {
          50: '#eceff1',
          100: '#cfd8dc',
          200: '#b0bec5',
          300: '#90a4ae',
          400: '#78909c',
          500: '#607d8b', // メイン金属
          600: '#546e7a',
          700: '#455a64',
          800: '#37474f',
          900: '#263238',
        },

        // 🔧 機能別ツールカラー（TD機能マッピング）
        // 測定ツール（CSV・データ計測）
        'wb-tool-measure': {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800', // 測定ツール（オレンジ）
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },

        // 切断ツール（ファイル操作・データ分割）
        'wb-tool-cut': {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336', // 切断ツール（レッド）
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
        },

        // 接合ツール（個人情報・データ組み立て）
        'wb-tool-join': {
          50: '#e8f5e8',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50', // 接合ツール（グリーン）
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },

        // 検査ツール（パスワード・セキュリティ確認）
        'wb-tool-inspect': {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3', // 検査ツール（ブルー）
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },

        // 仕上げツール（AI・高度な処理）
        'wb-tool-polish': {
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#9c27b0', // 仕上げツール（パープル）
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#4a148c',
        },

        // 🎯 ワークベンチ状態カラー
        'wb-success': '#4caf50', // 作業完了
        'wb-warning': '#ff9800', // 注意・調整中
        'wb-error': '#f44336', // エラー・修正必要
        'wb-info': '#2196f3', // 情報・ガイド
        'wb-neutral': '#9e9e9e', // 待機・中立

        // 🏭 作業環境カラー
        'wb-workshop': {
          bg: '#fafafa', // 工房背景
          surface: '#ffffff', // 作業面
          border: '#e0e0e0', // 境界線
          shadow: 'rgba(0, 0, 0, 0.1)', // 工房影
        },

        // 🎯 ステータスカラー（既存保持）
        'td-success': '#22C55E',
        'td-warning': '#F59E0B',
        'td-error': {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        'td-info': '#3B82F6',

        // 🔘 ベースカラー（既存保持）
        'td-gray': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // 🔗 機能別カラーエイリアス（TD機能とワークベンチツールの対応）
        password: {
          DEFAULT: '#2196f3', // wb-tool-inspect-500
          light: '#bbdefb', // wb-tool-inspect-100
          dark: '#1976d2', // wb-tool-inspect-700
        },
        personal: {
          DEFAULT: '#4caf50', // wb-tool-join-500
          light: '#c8e6c9', // wb-tool-join-100
          dark: '#388e3c', // wb-tool-join-700
        },
        csv: {
          DEFAULT: '#ff9800', // wb-tool-measure-500
          light: '#ffe0b2', // wb-tool-measure-100
          dark: '#f57c00', // wb-tool-measure-700
        },
        ai: {
          DEFAULT: '#9c27b0', // wb-tool-polish-500
          light: '#e1bee7', // wb-tool-polish-100
          dark: '#7b1fa2', // wb-tool-polish-700
        },
        file: {
          DEFAULT: '#f44336', // wb-tool-cut-500
          light: '#ffcdd2', // wb-tool-cut-100
          dark: '#d32f2f', // wb-tool-cut-700
        },
      },
      fontFamily: {
        td: ['Inter', 'Hiragino Sans', 'Noto Sans JP', 'sans-serif'],
        wb: ['Inter', 'Noto Sans JP', 'sans-serif'],
        'wb-mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'td-bounce': 'bounce 1s infinite',
        'td-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'td-spin': 'spin 1s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        // ワークベンチアニメーション
        'wb-work-pulse': 'wb-work-pulse 2s ease-in-out infinite',
        'wb-craft-shimmer': 'wb-craft-shimmer 3s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // ワークベンチキーフレーム
        'wb-work-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(96, 125, 139, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(96, 125, 139, 0)' },
        },
        'wb-craft-shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      spacing: {
        // ワークベンチスペーシング（8pxグリッド + 工具サイズ基準）
        'wb-1': '0.25rem', // 4px
        'wb-2': '0.5rem', // 8px
        'wb-3': '0.75rem', // 12px
        'wb-4': '1rem', // 16px
        'wb-5': '1.25rem', // 20px
        'wb-6': '1.5rem', // 24px
        'wb-8': '2rem', // 32px
        'wb-10': '2.5rem', // 40px
        'wb-12': '3rem', // 48px
        'wb-16': '4rem', // 64px
        // 工具サイズ基準
        'wb-tool-sm': '2rem', // 32px - 小工具
        'wb-tool-md': '2.5rem', // 40px - 標準工具
        'wb-tool-lg': '3rem', // 48px - 大工具
        'wb-tool-xl': '4rem', // 64px - 特大工具
      },
    },
  },
  plugins: [],
};
