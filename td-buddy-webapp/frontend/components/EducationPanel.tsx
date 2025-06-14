'use client';

import { AlertTriangle, BookOpen, Shield } from 'lucide-react';
import React, { useState } from 'react';

interface EducationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection?: string;
}

export const EducationPanel: React.FC<EducationPanelProps> = ({
  isOpen,
  onClose,
  scrollToSection,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vulnerabilities' | 'attacks' | 'examples'
  >('overview');

  // スクロール機能
  React.useEffect(() => {
    if (isOpen && scrollToSection) {
      // スクロール対象に応じて適切なタブに切り替え
      if (scrollToSection === 'security-guide') {
        setActiveTab('overview');
      } else if (scrollToSection === 'vulnerabilities-section') {
        setActiveTab('vulnerabilities');
      }

      // パネルが開いてタブが切り替わった後、少し遅延してスクロール
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 500); // タブ切り替えとパネルのアニメーション完了を待つ

      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToSection]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="wb-education-panel-overlay">
      <div className="wb-education-panel">
        <div className="wb-education-panel-header">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="wb-education-panel-title">
              パスワードセキュリティ教育コンテンツ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="wb-education-panel-close"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <div className="wb-education-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`wb-education-tab ${
              activeTab === 'overview' ? 'active' : ''
            }`}
          >
            📚 概要
          </button>
          <button
            onClick={() => setActiveTab('vulnerabilities')}
            className={`wb-education-tab ${
              activeTab === 'vulnerabilities' ? 'active' : ''
            }`}
          >
            ⚠️ 脆弱性タイプ
          </button>
          <button
            onClick={() => setActiveTab('attacks')}
            className={`wb-education-tab ${
              activeTab === 'attacks' ? 'active' : ''
            }`}
          >
            🎯 攻撃手法
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`wb-education-tab ${
              activeTab === 'examples' ? 'active' : ''
            }`}
          >
            📰 実際の事例
          </button>
        </div>

        <div className="wb-education-content">
          {activeTab === 'overview' && (
            <div className="wb-education-section" id="security-guide">
              <h3 className="wb-education-section-title">
                パスワードセキュリティの重要性
              </h3>

              <div className="wb-education-cards">
                <div className="wb-education-card">
                  <div className="wb-education-card-header">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4>強いパスワードの特徴</h4>
                  </div>
                  <ul className="wb-education-list">
                    <li>12文字以上の長さ</li>
                    <li>大文字・小文字・数字・記号の組み合わせ</li>
                    <li>辞書にない単語や予測困難なパターン</li>
                    <li>個人情報（誕生日、名前等）を含まない</li>
                    <li>他のサービスと異なるユニークなパスワード</li>
                  </ul>
                </div>

                <div className="wb-education-card">
                  <div className="wb-education-card-header">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4>弱いパスワードのリスク</h4>
                  </div>
                  <ul className="wb-education-list">
                    <li>アカウント乗っ取りの危険性</li>
                    <li>個人情報・金融情報の漏洩</li>
                    <li>企業の機密情報への不正アクセス</li>
                    <li>他のサービスへの連鎖攻撃</li>
                    <li>信頼失墜と経済的損失</li>
                  </ul>
                </div>
              </div>

              <div className="wb-education-stats">
                <h4 className="wb-education-section-subtitle">統計データ</h4>
                <div className="wb-education-stat-grid">
                  <div className="wb-education-stat-item">
                    <span className="wb-education-stat-number">80%</span>
                    <span className="wb-education-stat-label">
                      のデータ漏洩が弱いパスワードに起因
                    </span>
                  </div>
                  <div className="wb-education-stat-item">
                    <span className="wb-education-stat-number">5分</span>
                    <span className="wb-education-stat-label">
                      8文字パスワードの平均解読時間
                    </span>
                  </div>
                  <div className="wb-education-stat-item">
                    <span className="wb-education-stat-number">300億年</span>
                    <span className="wb-education-stat-label">
                      16文字複合パスワードの解読時間
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vulnerabilities' && (
            <div className="wb-education-section" id="vulnerabilities-section">
              <h3 className="wb-education-section-title">
                脆弱性タイプ別詳細説明
              </h3>

              <div className="wb-vulnerability-types">
                <div className="wb-vulnerability-type-card">
                  <div className="wb-vulnerability-type-header">
                    <span className="wb-vulnerability-type-icon">📝</span>
                    <h4>一般的な脆弱パスワード</h4>
                    <span className="wb-vulnerability-severity critical">
                      危険度: 最高
                    </span>
                  </div>
                  <div className="wb-vulnerability-type-content">
                    <p>
                      <strong>概要:</strong>{' '}
                      よく使われる単純なパスワードパターン
                    </p>
                    <p>
                      <strong>例:</strong> password, 123456, qwerty, admin
                    </p>
                    <p>
                      <strong>リスク:</strong> 辞書攻撃で数秒で破られる可能性
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      予測困難で個人的な意味を持つフレーズを使用
                    </p>
                  </div>
                </div>

                <div className="wb-vulnerability-type-card">
                  <div className="wb-vulnerability-type-header">
                    <span className="wb-vulnerability-type-icon">🔄</span>
                    <h4>連続パターン</h4>
                    <span className="wb-vulnerability-severity high">
                      危険度: 高
                    </span>
                  </div>
                  <div className="wb-vulnerability-type-content">
                    <p>
                      <strong>概要:</strong>{' '}
                      連続する文字や数字を使用したパスワード
                    </p>
                    <p>
                      <strong>例:</strong> 123456, abcdef, qwerty
                    </p>
                    <p>
                      <strong>リスク:</strong> パターン攻撃で短時間で解読される
                    </p>
                    <p>
                      <strong>対策:</strong> ランダムな文字配置を使用
                    </p>
                  </div>
                </div>

                <div className="wb-vulnerability-type-card">
                  <div className="wb-vulnerability-type-header">
                    <span className="wb-vulnerability-type-icon">🔠</span>
                    <h4>文字種不足</h4>
                    <span className="wb-vulnerability-severity medium">
                      危険度: 中
                    </span>
                  </div>
                  <div className="wb-vulnerability-type-content">
                    <p>
                      <strong>概要:</strong> 単一または少数の文字種のみを使用
                    </p>
                    <p>
                      <strong>例:</strong> onlylowercase, ONLYUPPERCASE,
                      1234567890
                    </p>
                    <p>
                      <strong>リスク:</strong>{' '}
                      文字空間が狭く、ブルートフォース攻撃に脆弱
                    </p>
                    <p>
                      <strong>対策:</strong> 複数の文字種を組み合わせて使用
                    </p>
                  </div>
                </div>

                <div className="wb-vulnerability-type-card">
                  <div className="wb-vulnerability-type-header">
                    <span className="wb-vulnerability-type-icon">📏</span>
                    <h4>短すぎるパスワード</h4>
                    <span className="wb-vulnerability-severity critical">
                      危険度: 最高
                    </span>
                  </div>
                  <div className="wb-vulnerability-type-content">
                    <p>
                      <strong>概要:</strong> 8文字未満の短いパスワード
                    </p>
                    <p>
                      <strong>例:</strong> pass, 1234, abc
                    </p>
                    <p>
                      <strong>リスク:</strong>{' '}
                      現代のコンピューターで数秒〜数分で解読
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      最低12文字、理想的には16文字以上を使用
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attacks' && (
            <div className="wb-education-section">
              <h3 className="wb-education-section-title">攻撃手法の解説</h3>

              <div className="wb-attack-methods">
                <div className="wb-attack-method-card">
                  <div className="wb-attack-method-header">
                    <span className="wb-attack-method-icon">📖</span>
                    <h4>辞書攻撃 (Dictionary Attack)</h4>
                    <div className="wb-attack-difficulty">
                      <span className="wb-attack-difficulty-badge trivial">
                        難易度: 極低
                      </span>
                      <span className="wb-attack-time-badge">
                        時間: 数秒〜数分
                      </span>
                    </div>
                  </div>
                  <div className="wb-attack-method-content">
                    <p>
                      <strong>手法:</strong>{' '}
                      一般的な単語やパスワードのリストを使用した攻撃
                    </p>
                    <p>
                      <strong>対象:</strong> よく使われるパスワード、辞書の単語
                    </p>
                    <p>
                      <strong>ツール:</strong> John the Ripper, Hashcat, Hydra
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      辞書にない語句、複数単語の組み合わせ
                    </p>
                  </div>
                </div>

                <div className="wb-attack-method-card">
                  <div className="wb-attack-method-header">
                    <span className="wb-attack-method-icon">💪</span>
                    <h4>ブルートフォース攻撃 (Brute Force Attack)</h4>
                    <div className="wb-attack-difficulty">
                      <span className="wb-attack-difficulty-badge easy">
                        難易度: 低
                      </span>
                      <span className="wb-attack-time-badge">
                        時間: 数分〜数年
                      </span>
                    </div>
                  </div>
                  <div className="wb-attack-method-content">
                    <p>
                      <strong>手法:</strong>{' '}
                      すべての可能な文字組み合わせを総当たりで試行
                    </p>
                    <p>
                      <strong>対象:</strong> 短いパスワード、単純な構成
                    </p>
                    <p>
                      <strong>計算力:</strong> GPU クラスター、ASIC マイナー
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      長いパスワード（12文字以上）、複雑な構成
                    </p>
                  </div>
                </div>

                <div className="wb-attack-method-card">
                  <div className="wb-attack-method-header">
                    <span className="wb-attack-method-icon">🌈</span>
                    <h4>レインボーテーブル攻撃 (Rainbow Tables)</h4>
                    <div className="wb-attack-difficulty">
                      <span className="wb-attack-difficulty-badge medium">
                        難易度: 中
                      </span>
                      <span className="wb-attack-time-badge">
                        時間: 即座〜数分
                      </span>
                    </div>
                  </div>
                  <div className="wb-attack-method-content">
                    <p>
                      <strong>手法:</strong>{' '}
                      事前計算されたハッシュテーブルを使用
                    </p>
                    <p>
                      <strong>対象:</strong> ハッシュ化されたパスワード
                    </p>
                    <p>
                      <strong>効果:</strong> 計算時間を大幅短縮、即座に解読可能
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      ソルト付きハッシュ、長い複雑なパスワード
                    </p>
                  </div>
                </div>

                <div className="wb-attack-method-card">
                  <div className="wb-attack-method-header">
                    <span className="wb-attack-method-icon">🧩</span>
                    <h4>ハイブリッド攻撃 (Hybrid Attack)</h4>
                    <div className="wb-attack-difficulty">
                      <span className="wb-attack-difficulty-badge medium">
                        難易度: 中
                      </span>
                      <span className="wb-attack-time-badge">
                        時間: 数分〜数時間
                      </span>
                    </div>
                  </div>
                  <div className="wb-attack-method-content">
                    <p>
                      <strong>手法:</strong>{' '}
                      辞書攻撃と文字変換ルールの組み合わせ
                    </p>
                    <p>
                      <strong>対象:</strong> 単語+数字、l33t speak
                      などの変換パターン
                    </p>
                    <p>
                      <strong>例:</strong> password123, p@ssw0rd, Password!
                    </p>
                    <p>
                      <strong>対策:</strong>{' '}
                      予測困難なパターン、複数単語の組み合わせ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="wb-education-section">
              <h3 className="wb-education-section-title">
                実際のデータ漏洩事例
              </h3>

              <div className="wb-breach-examples">
                <div className="wb-breach-example-card">
                  <div className="wb-breach-example-header">
                    <span className="wb-breach-year">2019</span>
                    <h4>Collection #1 データ漏洩</h4>
                    <span className="wb-breach-scale">
                      規模: 21億アカウント
                    </span>
                  </div>
                  <div className="wb-breach-example-content">
                    <p>
                      <strong>概要:</strong> 史上最大規模のパスワード漏洩事件
                    </p>
                    <p>
                      <strong>発見されたパスワード TOP5:</strong>
                    </p>
                    <ol className="wb-breach-password-list">
                      <li>123456 (2,300万回使用)</li>
                      <li>123456789 (760万回使用)</li>
                      <li>qwerty (380万回使用)</li>
                      <li>password (330万回使用)</li>
                      <li>111111 (300万回使用)</li>
                    </ol>
                    <p>
                      <strong>教訓:</strong>{' '}
                      同じ弱いパスワードを何百万人もが使用していた
                    </p>
                    <div className="wb-breach-sources">
                      <p>
                        <strong>情報源:</strong>
                      </p>
                      <ul className="wb-source-links">
                        <li>
                          <a
                            href="https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E4%BE%B5%E5%AE%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📰 Wikipedia - データ侵害事例一覧
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://haveibeenpwned.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🔍 Have I Been Pwned - 漏洩確認サービス
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.ipa.go.jp/security/vuln/report/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📊 IPA - 脆弱性対策情報
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="wb-breach-example-card">
                  <div className="wb-breach-example-header">
                    <span className="wb-breach-year">2012/2016</span>
                    <h4>LinkedIn データ漏洩事件</h4>
                    <span className="wb-breach-scale">
                      規模: 1億1,700万アカウント
                    </span>
                  </div>
                  <div className="wb-breach-example-content">
                    <p>
                      <strong>概要:</strong>{' '}
                      2012年に発生した漏洩が2016年に再発覚した大規模事件
                    </p>
                    <p>
                      <strong>漏洩した情報:</strong>
                    </p>
                    <ul className="wb-breach-password-list">
                      <li>メールアドレス</li>
                      <li>ハッシュ化されたパスワード（ソルトなし）</li>
                      <li>LinkedInメンバーID（内部識別子）</li>
                    </ul>
                    <p>
                      <strong>問題点:</strong>{' '}
                      当初はソルト処理なしの弱いハッシュ化のみ
                    </p>
                    <p>
                      <strong>LinkedIn の対応:</strong>
                    </p>
                    <ul className="wb-breach-password-list">
                      <li>被害アカウントのパスワード無効化</li>
                      <li>2段階認証オプションの追加</li>
                      <li>ソルト処理とハッシュ化の強化</li>
                      <li>不審なアクセスの自動検知システム導入</li>
                    </ul>
                    <p>
                      <strong>教訓:</strong>{' '}
                      適切なパスワード保護技術と定期的な変更の重要性
                    </p>
                    <div className="wb-breach-sources">
                      <p>
                        <strong>情報源:</strong>
                      </p>
                      <ul className="wb-source-links">
                        <li>
                          <a
                            href="https://www.linkedin.com/help/recruiter/answer/a1338522?lang=ja"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🏢 LinkedIn公式発表 - 2016年5月報告
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://haveibeenpwned.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🔍 Have I Been Pwned - 漏洩確認サービス
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.ipa.go.jp/security/index.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📰 IPA - 情報セキュリティ
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="wb-breach-example-card">
                  <div className="wb-breach-example-header">
                    <span className="wb-breach-year">2013</span>
                    <h4>Adobe 情報漏洩</h4>
                    <span className="wb-breach-scale">
                      規模: 1億5,300万アカウント
                    </span>
                  </div>
                  <div className="wb-breach-example-content">
                    <p>
                      <strong>概要:</strong>{' '}
                      クリエイティブソフトウェア会社の大規模攻撃
                    </p>
                    <p>
                      <strong>発見:</strong>{' '}
                      暗号化が不適切で、多くのパスワードが解読された
                    </p>
                    <p>
                      <strong>分析結果:</strong>
                    </p>
                    <ul className="wb-breach-password-list">
                      <li>1,900万人が「123456」を使用</li>
                      <li>photoshop, adobe などの関連語が上位</li>
                      <li>8文字未満のパスワードが全体の40%</li>
                    </ul>
                    <p>
                      <strong>教訓:</strong>{' '}
                      短いパスワードは現代技術では即座に解読される
                    </p>
                    <div className="wb-breach-sources">
                      <p>
                        <strong>情報源:</strong>
                      </p>
                      <ul className="wb-source-links">
                        <li>
                          <a
                            href="https://ja.wikipedia.org/wiki/Adobe_Systems"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🏢 Wikipedia - Adobe データ侵害事件
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://haveibeenpwned.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🔍 Have I Been Pwned - 漏洩確認サービス
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.jpcert.or.jp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📰 JPCERT/CC - セキュリティ情報
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.nisc.go.jp/security-site/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📊 NISC - サイバーセキュリティ
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="wb-breach-example-card">
                  <div className="wb-breach-example-header">
                    <span className="wb-breach-year">2020</span>
                    <h4>企業へのランサムウェア攻撃</h4>
                    <span className="wb-breach-scale">
                      規模: 全世界で数千企業
                    </span>
                  </div>
                  <div className="wb-breach-example-content">
                    <p>
                      <strong>概要:</strong> 弱いパスワードを狙ったRDP攻撃の急増
                    </p>
                    <p>
                      <strong>攻撃手法:</strong>{' '}
                      リモートデスクトップの弱いパスワードを突破
                    </p>
                    <p>
                      <strong>よく狙われるパスワード:</strong>
                    </p>
                    <ul className="wb-breach-password-list">
                      <li>admin</li>
                      <li>administrator</li>
                      <li>root</li>
                      <li>server</li>
                      <li>password123</li>
                    </ul>
                    <p>
                      <strong>教訓:</strong>{' '}
                      システム管理者のパスワードは特に強固にする必要
                    </p>
                    <div className="wb-breach-sources">
                      <p>
                        <strong>情報源:</strong>
                      </p>
                      <ul className="wb-source-links">
                        <li>
                          <a
                            href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-302a"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🏛️ CISA - ランサムウェア対策ガイド
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.fbi.gov/news/press-releases/fbi-releases-indicators-of-compromise-associated-with-ragnar-locker-ransomware"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🔍 FBI - ランサムウェア攻撃分析
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.crowdstrike.com/blog/2020-crowdstrike-global-threat-report/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            📊 CrowdStrike - 2020年脅威レポート
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.microsoft.com/security/blog/2020/04/28/protecting-against-rdp-brute-force-attacks/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wb-source-link"
                          >
                            🛡️ Microsoft - RDP攻撃対策
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wb-breach-example-card">
                <div className="wb-breach-example-header">
                  <span className="wb-breach-year">2014</span>
                  <h4>ベネッセ個人情報漏洩事件</h4>
                  <span className="wb-breach-scale">
                    規模: 約3,504万件の個人情報
                  </span>
                </div>
                <div className="wb-breach-example-content">
                  <p>
                    <strong>概要:</strong>{' '}
                    日本最大級の個人情報漏洩事件、内部犯行による
                  </p>
                  <p>
                    <strong>問題:</strong>{' '}
                    システムアクセス権限の管理不備、弱いパスワード設定
                  </p>
                  <p>
                    <strong>影響:</strong>
                  </p>
                  <ul className="wb-breach-password-list">
                    <li>顧客の氏名、住所、電話番号、生年月日が漏洩</li>
                    <li>子どもの学習進度情報も含まれる</li>
                    <li>200億円超の損害賠償</li>
                  </ul>
                  <p>
                    <strong>教訓:</strong>{' '}
                    内部アクセスでも強固な認証とアクセス制御が必要
                  </p>
                  <div className="wb-breach-sources">
                    <p>
                      <strong>情報源:</strong>
                    </p>
                    <ul className="wb-source-links">
                      <li>
                        <a
                          href="https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%8D%E3%83%83%E3%82%BB%E5%80%8B%E4%BA%BA%E6%83%85%E5%A0%B1%E6%BC%8F%E6%B4%A9%E4%BA%8B%E4%BB%B6"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏢 Wikipedia - ベネッセ個人情報漏洩事件
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.ppc.go.jp/personalinfo/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏛️ 個人情報保護委員会 - 個人情報保護法
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.ipa.go.jp/security/guide/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          📊 IPA - セキュリティ対策ガイド
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="wb-breach-example-card">
                <div className="wb-breach-example-header">
                  <span className="wb-breach-year">2019</span>
                  <h4>7pay 不正利用事件</h4>
                  <span className="wb-breach-scale">
                    規模: 約5,500万円の被害
                  </span>
                </div>
                <div className="wb-breach-example-content">
                  <p>
                    <strong>概要:</strong>{' '}
                    セブン&アイの決済アプリで大規模不正利用が発生
                  </p>
                  <p>
                    <strong>問題:</strong>{' '}
                    2段階認証なし、パスワードリセット機能の脆弱性
                  </p>
                  <p>
                    <strong>攻撃手法:</strong>
                  </p>
                  <ul className="wb-breach-password-list">
                    <li>他サービスから流出したID・パスワードを使用</li>
                    <li>パスワードリセット機能を悪用</li>
                    <li>SMS認証の迂回</li>
                  </ul>
                  <p>
                    <strong>教訓:</strong>{' '}
                    パスワードの使い回しと弱い認証システムの危険性
                  </p>
                  <div className="wb-breach-sources">
                    <p>
                      <strong>情報源:</strong>
                    </p>
                    <ul className="wb-source-links">
                      <li>
                        <a
                          href="https://ja.wikipedia.org/wiki/7pay"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏢 Wikipedia - 7pay不正利用事件
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.nisc.go.jp/policy/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏛️ NISC - サイバーセキュリティ政策
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.ipa.go.jp/security/anshin/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          📊 IPA - 安心相談窓口
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="wb-breach-example-card">
                <div className="wb-breach-example-header">
                  <span className="wb-breach-year">2021</span>
                  <h4>LINE 個人情報管理問題</h4>
                  <span className="wb-breach-scale">
                    規模: 日本ユーザー約8,600万人
                  </span>
                </div>
                <div className="wb-breach-example-content">
                  <p>
                    <strong>概要:</strong>{' '}
                    日本ユーザーの個人情報が韓国・中国からアクセス可能だった
                  </p>
                  <p>
                    <strong>問題:</strong>{' '}
                    アクセス権限管理の不備、監査ログの不足
                  </p>
                  <p>
                    <strong>影響:</strong>
                  </p>
                  <ul className="wb-breach-password-list">
                    <li>トーク履歴、連絡先、位置情報へのアクセス</li>
                    <li>政府機関のLINE利用停止</li>
                    <li>プライバシーポリシーの大幅見直し</li>
                  </ul>
                  <p>
                    <strong>教訓:</strong>{' '}
                    国際的なデータ管理では厳格なアクセス制御が必要
                  </p>
                  <div className="wb-breach-sources">
                    <p>
                      <strong>情報源:</strong>
                    </p>
                    <ul className="wb-source-links">
                      <li>
                        <a
                          href="https://ja.wikipedia.org/wiki/LINE_(%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏢 Wikipedia - LINE個人情報管理問題
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.ppc.go.jp/enforcement/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          🏛️ 個人情報保護委員会 - 執行状況
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.soumu.go.jp/menu_seisaku/ictseisaku/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wb-source-link"
                        >
                          📊 総務省 - ICT政策
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="wb-education-footer">
                <div className="wb-education-footer-content">
                  <h4>これらの事例から学ぶべきこと</h4>
                  <ul className="wb-education-lessons">
                    <li>弱いパスワードは世界中で共通して使用されている</li>
                    <li>攻撃者はこれらのパターンを熟知している</li>
                    <li>一度漏洩したパスワードは攻撃辞書に追加される</li>
                    <li>技術の進歩により、短いパスワードは秒単位で破られる</li>
                    <li>強いパスワードとパスワード管理ツールの使用が不可欠</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
