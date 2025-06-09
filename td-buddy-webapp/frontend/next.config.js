/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // バックエンドAPIへのプロキシ設定
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  // 画像最適化設定
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig; 