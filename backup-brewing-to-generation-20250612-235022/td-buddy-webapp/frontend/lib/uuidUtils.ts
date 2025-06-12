// 🆔 ローカルUUID生成ユーティリティ

import {
  UuidGenerateRequest,
  UuidGenerateResponse,
  UuidItem,
} from '../types/uuid';

export interface LocalUuidOptions {
  count: number;
  version: 'v1' | 'v4' | 'v6' | 'v7' | 'mixed';
  format: 'standard' | 'compact' | 'uppercase' | 'with-prefix' | 'sql-friendly';
}

// セキュアな乱数生成
function getSecureRandomValues(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// UUID v4 生成
function generateUuidV4(): string {
  const bytes = getSecureRandomValues(16);

  // Version 4のビット設定
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

  // 16進数文字列に変換
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // ハイフン挿入
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// 簡易UUID v1 生成（タイムスタンプベース）
function generateUuidV1(): string {
  const timestamp = Date.now();
  const random = getSecureRandomValues(10);

  // 簡易的なv1フォーマット
  const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
  const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
  const timeHi = (0x1000 | ((timestamp >> 48) & 0x0fff))
    .toString(16)
    .padStart(4, '0');

  const clockSeq =
    ((random[0] & 0x3f) | 0x80).toString(16).padStart(2, '0') +
    random[1].toString(16).padStart(2, '0');

  const node = Array.from(random.slice(2, 8))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

// フォーマット変換
function formatUuid(uuid: string, format: string): string {
  const clean = uuid.replace(/-/g, '');

  switch (format) {
    case 'compact':
      return clean;
    case 'uppercase':
      return uuid.toUpperCase();
    case 'with-prefix':
      return `UUID:${uuid}`;
    case 'sql-friendly':
      return `'${uuid}'`;
    case 'standard':
    default:
      return uuid.toLowerCase();
  }
}

// ローカルUUID生成
export function generateUuidsLocal(
  options: LocalUuidOptions
): UuidGenerateResponse {
  const { count, version, format } = options;
  const startTime = Date.now();

  const uuids: UuidItem[] = [];
  const versionDistribution: Record<string, number> = {};

  // 指定された数のUUIDを生成
  for (let i = 0; i < count; i++) {
    let uuid: string;
    let actualVersion: string;

    if (version === 'mixed') {
      // mixedの場合は v1 と v4 をランダムに選択
      const versions = ['v1', 'v4'];
      actualVersion = versions[Math.floor(Math.random() * versions.length)];
    } else {
      actualVersion = version;
    }

    switch (actualVersion) {
      case 'v1':
        uuid = generateUuidV1();
        break;
      case 'v4':
      default:
        uuid = generateUuidV4();
        break;
      // v6, v7は簡易実装ではv4を使用
      case 'v6':
      case 'v7':
        uuid = generateUuidV4();
        actualVersion = 'v4'; // 実際はv4として記録
        break;
    }

    // バージョン分布をカウント
    versionDistribution[actualVersion] =
      (versionDistribution[actualVersion] || 0) + 1;

    const formattedUuid = formatUuid(uuid, format);
    const now = new Date().toISOString();

    uuids.push({
      id: `local-${i}-${Date.now()}`,
      uuid: formattedUuid,
      version: actualVersion,
      format,
      timestamp: now,
      generatedAt: now,
      metadata: {
        isValid: true,
        entropy: 122, // UUID v4の理論的エントロピー
        randomness: 'cryptographic', // crypto.getRandomValues使用
      },
    });
  }

  const generationTime = Date.now() - startTime;

  return {
    uuids,
    criteria: { count, version, format } as UuidGenerateRequest,
    statistics: {
      totalGenerated: uuids.length,
      versionDistribution,
      formatDistribution: { [format]: uuids.length },
      averageEntropy: 122,
    },
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
  };
}
