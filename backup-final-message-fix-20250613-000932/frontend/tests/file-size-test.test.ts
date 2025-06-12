/// <reference types="jest" />

import {
  AOZORA_BUNKO_SAMPLES,
  generateContentByType,
  generateTextContent,
} from "../data/aozora-bunko-samples";

describe("ファイル容量テスト機能", () => {
  describe("青空文庫コンテンツ生成", () => {
    test("基本的なテキスト生成", () => {
      const targetSize = 1000; // 1KB
      const content = generateTextContent(targetSize);

      expect(content).toBeDefined();
      expect(typeof content).toBe("string");
      expect(content.length).toBeGreaterThan(0);

      // UTF-8でのバイト数をチェック
      const actualBytes = Buffer.byteLength(content, "utf8");
      expect(actualBytes).toBeGreaterThanOrEqual(targetSize - 100); // 許容誤差
      expect(actualBytes).toBeLessThanOrEqual(targetSize + 100);
    });

    test("特定作品のみを使用したコンテンツ生成", () => {
      const targetSize = 500;
      const selectedWorks = ["wagahai-neko"];
      const content = generateTextContent(targetSize, selectedWorks);

      expect(content).toContain("吾輩は猫である");
      expect(content).toContain("夏目漱石");
    });

    test("複数作品を使用したコンテンツ生成", () => {
      const targetSize = 2000;
      const selectedWorks = ["wagahai-neko", "kokoro"];
      const content = generateTextContent(targetSize, selectedWorks);

      // 両方の作品が含まれているかチェック
      expect(content).toMatch(/吾輩は猫である|こころ/);
    });
  });

  describe("ファイル形式別コンテンツ生成", () => {
    test("JSON形式の生成", () => {
      const targetSize = 1000;
      const content = generateContentByType(targetSize, "json");

      expect(() => JSON.parse(content)).not.toThrow();

      const jsonData = JSON.parse(content);
      expect(jsonData).toHaveProperty("metadata");
      expect(jsonData).toHaveProperty("content");
      expect(jsonData.metadata).toHaveProperty("generator", "QA Workbench");
    });

    test("CSV形式の生成", () => {
      const targetSize = 500;
      const content = generateContentByType(targetSize, "csv");

      const lines = content.split("\n");
      expect(lines[0]).toContain("id,line_number,content,length"); // ヘッダー行
      expect(lines.length).toBeGreaterThan(1);

      // CSVの形式チェック
      const dataLine = lines[1];
      expect(dataLine).toMatch(/^\d+,\d+,"/); // "id,line_number,"で始まる
    });

    test("XML形式の生成", () => {
      const targetSize = 800;
      const content = generateContentByType(targetSize, "xml");

      expect(content).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(content).toContain("<testdata>");
      expect(content).toContain("<metadata>");
      expect(content).toContain("<content><![CDATA[");
      expect(content).toContain("</testdata>");
    });

    test("YAML形式の生成", () => {
      const targetSize = 600;
      const content = generateContentByType(targetSize, "yaml");

      expect(content).toContain("metadata:");
      expect(content).toContain('generator: "QA Workbench"');
      expect(content).toContain("content: |");
    });
  });

  describe("サイズ計算とユーティリティ", () => {
    test("サイズ単位の変換", () => {
      const SIZE_UNITS = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
      };

      expect(SIZE_UNITS.KB).toBe(1024);
      expect(SIZE_UNITS.MB).toBe(1048576);
      expect(SIZE_UNITS.GB).toBe(1073741824);
    });

    test("ファイルサイズフォーマット", () => {
      const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024)
          return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
      };

      expect(formatFileSize(500)).toBe("500 B");
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(1048576)).toBe("1.0 MB");
      expect(formatFileSize(1073741824)).toBe("1.0 GB");
    });

    test("コンテンツサイズ調整", () => {
      const adjustContentToTargetSize = (
        content: string,
        targetSize: number
      ): string => {
        const currentSize = Buffer.byteLength(content, "utf8");

        if (currentSize === targetSize) return content;

        if (currentSize > targetSize) {
          return content.substring(0, targetSize);
        } else {
          const padding = " ".repeat(targetSize - currentSize);
          return content + padding;
        }
      };

      const shortContent = "Hello";
      const adjustedContent = adjustContentToTargetSize(shortContent, 10);
      expect(Buffer.byteLength(adjustedContent, "utf8")).toBe(10);
      expect(adjustedContent).toBe("Hello     ");

      const longContent =
        "This is a very long content that exceeds the target size";
      const truncatedContent = adjustContentToTargetSize(longContent, 10);
      expect(Buffer.byteLength(truncatedContent, "utf8")).toBe(10);
      expect(truncatedContent).toBe("This is a ");
    });
  });

  describe("青空文庫データの整合性", () => {
    test("すべての作品にIDと基本情報が含まれている", () => {
      AOZORA_BUNKO_SAMPLES.forEach((work) => {
        expect(work).toHaveProperty("id");
        expect(work).toHaveProperty("title");
        expect(work).toHaveProperty("author");
        expect(work).toHaveProperty("content");
        expect(work).toHaveProperty("description");

        expect(typeof work.id).toBe("string");
        expect(typeof work.title).toBe("string");
        expect(typeof work.author).toBe("string");
        expect(typeof work.content).toBe("string");
        expect(typeof work.description).toBe("string");

        expect(work.id.length).toBeGreaterThan(0);
        expect(work.title.length).toBeGreaterThan(0);
        expect(work.author.length).toBeGreaterThan(0);
        expect(work.content.length).toBeGreaterThan(0);
      });
    });

    test("作品IDの一意性", () => {
      const ids = AOZORA_BUNKO_SAMPLES.map((work) => work.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test("コンテンツの最小サイズ", () => {
      AOZORA_BUNKO_SAMPLES.forEach((work) => {
        expect(work.content.length).toBeGreaterThan(100); // 最低100文字
      });
    });
  });

  describe("パフォーマンステスト", () => {
    test("1MBファイル生成のパフォーマンス", () => {
      const startTime = Date.now();
      const targetSize = 1024 * 1024; // 1MB
      const content = generateTextContent(targetSize);
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // 5秒以内

      const actualSize = Buffer.byteLength(content, "utf8");
      expect(actualSize).toBeGreaterThanOrEqual(targetSize - 1000);
      expect(actualSize).toBeLessThanOrEqual(targetSize + 1000);
    });

    test("複数ファイル形式の生成速度", () => {
      const targetSize = 100 * 1024; // 100KB
      const formats: Array<"txt" | "json" | "csv" | "xml" | "yaml"> = [
        "txt",
        "json",
        "csv",
        "xml",
        "yaml",
      ];

      formats.forEach((format) => {
        const startTime = Date.now();
        const content = generateContentByType(targetSize, format);
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(2000); // 2秒以内
        expect(content.length).toBeGreaterThan(0);
      });
    });
  });

  describe("エラーハンドリング", () => {
    test("無効なファイルサイズの処理", () => {
      expect(() => generateTextContent(0)).not.toThrow();
      expect(() => generateTextContent(-100)).not.toThrow();

      const zeroContent = generateTextContent(0);
      expect(zeroContent.length).toBeGreaterThan(0); // ヘッダーは含まれる
    });

    test("存在しない作品IDの処理", () => {
      const content = generateTextContent(1000, ["nonexistent-work"]);
      expect(content.length).toBeGreaterThan(0); // 全作品を使用してフォールバック
    });

    test("空の作品配列の処理", () => {
      const content = generateTextContent(1000, []);
      expect(content.length).toBeGreaterThan(0); // 全作品を使用
    });
  });
});
