/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを有効化（Netlify向け）
  output: 'export',
  trailingSlash: true,

  // 画像最適化を無効化（静的エクスポート時は必須）
  images: {
    unoptimized: true,
  },

  // ベースパス設定（必要に応じて）
  // basePath: '',
  // assetPrefix: '',

  experimental: {
    // appDir は Next.js 13.4+ では不要（デフォルトで有効）
  },
  typescript: {
    // TypeScriptエラーがあってもビルドを続行
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLintエラーがあってもビルドを続行
    ignoreDuringBuilds: false,
  },

  // 静的エクスポート時はrewrites無効
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3001/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
