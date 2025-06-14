import {
  ExportData,
  ExportOptions,
  VulnerabilityAnalysis,
} from '../types/password';

// CSV形式でエクスポート
export function exportToCSV(data: ExportData, options: ExportOptions): string {
  const headers = ['Password'];

  if (options.includeAnalysis && data.analysis) {
    headers.push(
      'Vulnerability Score',
      'Risk Level',
      'Main Issues',
      'Recommendations'
    );
  }

  if (options.includeMetadata) {
    headers.push('Generated At', 'Preset', 'Length');
  }

  const rows = [headers.join(',')];

  data.passwords.forEach((password, index) => {
    const row = [password];

    if (options.includeAnalysis && data.analysis && data.analysis[index]) {
      const analysis = data.analysis[index];
      row.push(
        analysis.vulnerabilityScore.toString(),
        getVulnerabilityLevelText(analysis.vulnerabilityScore),
        analysis.vulnerabilities.map(v => v.description).join('; '),
        analysis.recommendations.slice(0, 3).join('; ')
      );
    }

    if (options.includeMetadata) {
      row.push(
        data.metadata.generatedAt,
        data.metadata.preset,
        password.length.toString()
      );
    }

    rows.push(row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','));
  });

  return rows.join('\n');
}

// JSON形式でエクスポート
export function exportToJSON(data: ExportData, options: ExportOptions): string {
  const exportData: any = {
    passwords: data.passwords,
    metadata: data.metadata,
  };

  if (options.includeAnalysis && data.analysis) {
    exportData.analysis = data.analysis;
  }

  if (options.groupByVulnerability && data.analysis) {
    exportData.groupedByVulnerability = groupPasswordsByVulnerability(
      data.passwords,
      data.analysis
    );
  }

  return JSON.stringify(exportData, null, 2);
}

// テキスト形式でエクスポート
export function exportToTXT(data: ExportData, options: ExportOptions): string {
  let content = `# パスワード生成結果\n\n`;
  content += `生成日時: ${data.metadata.generatedAt}\n`;
  content += `プリセット: ${data.metadata.preset}\n`;
  content += `総数: ${data.metadata.totalCount}\n\n`;

  if (options.groupByVulnerability && data.analysis) {
    const grouped = groupPasswordsByVulnerability(
      data.passwords,
      data.analysis
    );

    Object.entries(grouped).forEach(([level, passwords]) => {
      content += `## ${getVulnerabilityLevelText(parseInt(level))} (${
        passwords.length
      }個)\n\n`;
      passwords.forEach((password, index) => {
        content += `${index + 1}. ${password}\n`;

        if (options.includeAnalysis) {
          const analysis = data.analysis?.find(
            (_, i) => data.passwords[i] === password
          );
          if (analysis) {
            content += `   脆弱性スコア: ${analysis.vulnerabilityScore}/100\n`;
            content += `   主な問題: ${analysis.vulnerabilities
              .map(v => v.description)
              .join(', ')}\n`;
          }
        }
        content += '\n';
      });
    });
  } else {
    content += `## パスワード一覧\n\n`;
    data.passwords.forEach((password, index) => {
      content += `${index + 1}. ${password}\n`;

      if (options.includeAnalysis && data.analysis && data.analysis[index]) {
        const analysis = data.analysis[index];
        content += `   脆弱性スコア: ${analysis.vulnerabilityScore}/100\n`;
        content += `   リスクレベル: ${getVulnerabilityLevelText(
          analysis.vulnerabilityScore
        )}\n`;
        content += `   主な問題: ${analysis.vulnerabilities
          .map(v => v.description)
          .join(', ')}\n`;
      }
      content += '\n';
    });
  }

  if (options.includeAnalysis && data.analysis) {
    content += `\n## 脆弱性分析サマリー\n\n`;
    const avgScore =
      data.analysis.reduce((sum, a) => sum + a.vulnerabilityScore, 0) /
      data.analysis.length;
    content += `平均脆弱性スコア: ${avgScore.toFixed(1)}/100\n`;

    const vulnerabilityTypes = data.analysis.flatMap(a =>
      a.vulnerabilities.map(v => v.type)
    );
    const typeCounts = vulnerabilityTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    content += `\n### 脆弱性タイプ別統計\n`;
    Object.entries(typeCounts).forEach(([type, count]) => {
      content += `- ${getVulnerabilityTypeLabel(type)}: ${count}件\n`;
    });
  }

  return content;
}

// 脆弱性レベル別にパスワードをグループ化
function groupPasswordsByVulnerability(
  passwords: string[],
  analyses: VulnerabilityAnalysis[]
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  passwords.forEach((password, index) => {
    const analysis = analyses[index];
    if (analysis) {
      const level = getVulnerabilityLevelFromScore(analysis.vulnerabilityScore);
      grouped[level].push(password);
    }
  });

  return grouped;
}

// 脆弱性スコアからレベルを取得
function getVulnerabilityLevelFromScore(score: number): string {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

// 脆弱性レベルのテキスト表現
function getVulnerabilityLevelText(score: number): string {
  if (score >= 80) return '極めて危険';
  if (score >= 60) return '高リスク';
  if (score >= 30) return '中リスク';
  return '低リスク';
}

// 脆弱性タイプのラベル
function getVulnerabilityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    length: '長さ不足',
    dictionary: '辞書攻撃脆弱',
    pattern: 'パターン脆弱',
    'character-set': '文字種不足',
    predictability: '予測可能',
    common: '一般的パスワード',
  };
  return labels[type] || type;
}

// ファイルダウンロード用のBlob作成
export function createDownloadBlob(content: string, format: string): Blob {
  const mimeTypes: Record<string, string> = {
    csv: 'text/csv;charset=utf-8',
    json: 'application/json;charset=utf-8',
    txt: 'text/plain;charset=utf-8',
  };

  return new Blob([content], { type: mimeTypes[format] || 'text/plain' });
}

// ファイル名生成
export function generateFileName(
  preset: string,
  format: string,
  timestamp: string
): string {
  const cleanPreset = preset.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTimestamp = timestamp.replace(/[^0-9]/g, '');
  return `passwords_${cleanPreset}_${cleanTimestamp}.${format}`;
}

// ダウンロード実行
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
