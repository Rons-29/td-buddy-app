'use client';

import { ArrowRight, CheckCircle, Clock, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface OptimizedHomepageProps {
  className?: string;
}

export const OptimizedHomepage: React.FC<OptimizedHomepageProps> = ({
  className = '',
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: 'テストデータ作成時間が90%短縮されました',
      author: 'QAエンジニア A様',
      company: 'IT企業',
    },
    {
      text: 'セキュアなパスワード生成で開発効率が向上',
      author: '開発チームリーダー B様',
      company: 'スタートアップ',
    },
    {
      text: 'CSV生成機能で大量データテストが簡単に',
      author: 'テストマネージャー C様',
      company: '大手企業',
    },
  ];

  const popularTools = [
    {
      id: 'password',
      name: 'パスワード生成',
      icon: '🔐',
      benefit: '強力なパスワードを瞬時に生成',
      time: '5秒',
      href: '/password',
      users: '1,200+',
    },
    {
      id: 'personal',
      name: '個人情報生成',
      icon: '👤',
      benefit: 'リアルなテストデータを大量作成',
      time: '10秒',
      href: '/personal',
      users: '800+',
    },
    {
      id: 'csv',
      name: 'CSV生成',
      icon: '📊',
      benefit: 'カスタムデータセットを簡単作成',
      time: '30秒',
      href: '/csv-detailed',
      users: '600+',
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}
    >
      {/* ヒーローセクション - F字型レイアウト最適化 */}
      <section className="conv-f-layout py-20 px-4">
        <div
          className={`conv-hero text-center ${
            isVisible ? 'conv-lazy-load loaded' : 'conv-lazy-load'
          }`}
        >
          <div className="mb-6">
            <div className="inline-flex items-center wb-badge-items px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              3,000+ QAエンジニアが利用中
            </div>
            <h1 className="conv-hierarchy-1 mb-6">
              テストデータ作成を
              <span className="text-blue-600">90%高速化</span>
            </h1>
            <p className="conv-hierarchy-3 text-gray-600 mb-8 max-w-2xl mx-auto">
              Quality Workbenchは、QAエンジニアの作業効率を劇的に向上させる
              オールインワンツールです。手作業でのデータ作成から解放され、
              本当に重要なテスト設計に集中できます。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/password"
              className="conv-cta-primary inline-flex items-center justify-center"
            >
              今すぐ無料で始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="conv-cta-secondary">デモを見る（2分）</button>
          </div>

          {/* 社会的証明 */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
            <div>
              <div className="conv-hierarchy-2 text-blue-600">90%</div>
              <div className="text-sm text-gray-600">時間短縮</div>
            </div>
            <div>
              <div className="conv-hierarchy-2 text-green-600">3,000+</div>
              <div className="text-sm text-gray-600">利用者数</div>
            </div>
            <div>
              <div className="conv-hierarchy-2 text-purple-600">12</div>
              <div className="text-sm text-gray-600">専用ツール</div>
            </div>
          </div>
        </div>
      </section>

      {/* 問題提起セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="conv-hierarchy-2 mb-8 text-gray-900">
            こんな課題、ありませんか？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-red-50 rounded-lg">
              <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-red-900">
                時間がかかりすぎる
              </h3>
              <p className="text-red-700 text-sm">
                テストデータ作成に1日の30%を費やしている
              </p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg">
              <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-yellow-900">
                セキュリティが心配
              </h3>
              <p className="text-yellow-700 text-sm">
                本番データを使うのはリスクが高い
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-blue-900">
                品質にばらつき
              </h3>
              <p className="text-blue-700 text-sm">
                チームメンバーごとにデータ品質が異なる
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 解決策セクション - 3-2-1ルール適用 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="conv-hierarchy-2 mb-4">
              Quality Workbenchが解決します
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              12の専用ツールで、あらゆるテストデータ作成ニーズに対応
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`
                  bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all
                  ${
                    index === 0
                      ? 'conv-importance-3 md:col-span-2 md:row-span-2'
                      : ''
                  }
                  ${index === 1 ? 'conv-importance-2' : ''}
                  ${index === 2 ? 'conv-importance-1' : ''}
                `}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{tool.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600">{tool.benefit}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {tool.time}で完了
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {tool.users}人が利用
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  今すぐ使う
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 顧客の声 - 社会的証明強化 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="conv-hierarchy-2 mb-12">利用者の声</h2>
          <div className="relative">
            <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
              <p className="text-xl mb-4 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="text-blue-200">
                <div className="font-semibold">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-sm">
                  {testimonials[currentTestimonial].company}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="conv-hierarchy-2 mb-4">
            今すぐテストデータ作成を効率化しませんか？
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            無料で始められます。クレジットカード不要、面倒な設定も不要。
            今すぐQuality Workbenchでテスト作業を革新しましょう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/password"
              className="conv-cta-primary inline-flex items-center justify-center"
            >
              無料で始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/ai-chat" className="conv-cta-secondary">
              AIアシスタントに相談
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            ✓ 無料利用可能　✓ 登録不要　✓ 即座に利用開始
          </p>
        </div>
      </section>
    </div>
  );
};
