export interface ExtractedColor {
  color: string;
  count: number;
  percentage: number;
  format: 'hex' | 'rgb' | 'hsl';
}

export interface ColorExtractionResult {
  success: boolean;
  colors: ExtractedColor[];
  dominantColor: string;
  palette: string[];
  message: string;
  sourceType: 'image' | 'html' | 'css';
  extractedAt: Date;
}

export class ColorExtractor {
  /**
   * 画像ファイルからカラーパレットを抽出
   */
  static async extractFromImage(file: File): Promise<ColorExtractionResult> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Canvas にリサイズして描画
          const maxSize = 100; // 処理速度のためリサイズ
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // ピクセルデータを取得
          const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // カラーマップを作成
          const colorMap = new Map<string, number>();
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // 透明度が低い場合はスキップ
            if (a < 128) continue;
            
            // 色を量子化（似た色をまとめる）
            const quantizedR = Math.round(r / 32) * 32;
            const quantizedG = Math.round(g / 32) * 32;
            const quantizedB = Math.round(b / 32) * 32;
            
            const hex = `#${quantizedR.toString(16).padStart(2, '0')}${quantizedG.toString(16).padStart(2, '0')}${quantizedB.toString(16).padStart(2, '0')}`;
            
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
          }
          
          // 頻度順にソート
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // 上位10色
          
          const totalPixels = canvas.width * canvas.height;
          const extractedColors: ExtractedColor[] = sortedColors.map(([color, count]) => ({
            color,
            count,
            percentage: Math.round((count / totalPixels) * 100 * 100) / 100,
            format: 'hex' as const
          }));
          
          const dominantColor = sortedColors[0]?.[0] || '#000000';
          const palette = sortedColors.map(([color]) => color);
          
          resolve({
            success: true,
            colors: extractedColors,
            dominantColor,
            palette,
            message: `画像から${extractedColors.length}色のパレットを抽出しました`,
            sourceType: 'image',
            extractedAt: new Date()
          });
        } catch (error) {
          resolve({
            success: false,
            colors: [],
            dominantColor: '#000000',
            palette: [],
            message: `画像の解析中にエラーが発生しました: ${error}`,
            sourceType: 'image',
            extractedAt: new Date()
          });
        }
      };
      
      img.onerror = () => {
        resolve({
          success: false,
          colors: [],
          dominantColor: '#000000',
          palette: [],
          message: '画像の読み込みに失敗しました',
          sourceType: 'image',
          extractedAt: new Date()
        });
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * HTMLファイルからCSSカラー情報を抽出
   */
  static async extractFromHTML(file: File): Promise<ColorExtractionResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const htmlContent = e.target?.result as string;
          const colors = this.parseColorsFromHTML(htmlContent);
          
          if (colors.length === 0) {
            resolve({
              success: false,
              colors: [],
              dominantColor: '#000000',
              palette: [],
              message: 'HTMLファイルからカラー情報が見つかりませんでした',
              sourceType: 'html',
              extractedAt: new Date()
            });
            return;
          }
          
          // 頻度をカウント
          const colorMap = new Map<string, number>();
          colors.forEach(color => {
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          });
          
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          const totalColors = colors.length;
          const extractedColors: ExtractedColor[] = sortedColors.map(([color, count]) => ({
            color,
            count,
            percentage: Math.round((count / totalColors) * 100 * 100) / 100,
            format: this.detectColorFormat(color)
          }));
          
          const dominantColor = sortedColors[0]?.[0] || '#000000';
          const palette = sortedColors.map(([color]) => color);
          
          resolve({
            success: true,
            colors: extractedColors,
            dominantColor,
            palette,
            message: `HTMLから${extractedColors.length}色のカラー情報を抽出しました`,
            sourceType: 'html',
            extractedAt: new Date()
          });
        } catch (error) {
          resolve({
            success: false,
            colors: [],
            dominantColor: '#000000',
            palette: [],
            message: `HTMLファイルの解析中にエラーが発生しました: ${error}`,
            sourceType: 'html',
            extractedAt: new Date()
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          colors: [],
          dominantColor: '#000000',
          palette: [],
          message: 'HTMLファイルの読み込みに失敗しました',
          sourceType: 'html',
          extractedAt: new Date()
        });
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * CSSファイルからカラー情報を抽出
   */
  static async extractFromCSS(file: File): Promise<ColorExtractionResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const cssContent = e.target?.result as string;
          const colors = this.parseColorsFromCSS(cssContent);
          
          if (colors.length === 0) {
            resolve({
              success: false,
              colors: [],
              dominantColor: '#000000',
              palette: [],
              message: 'CSSファイルからカラー情報が見つかりませんでした',
              sourceType: 'css',
              extractedAt: new Date()
            });
            return;
          }
          
          // 頻度をカウント
          const colorMap = new Map<string, number>();
          colors.forEach(color => {
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          });
          
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1]);
          
          const totalColors = colors.length;
          const extractedColors: ExtractedColor[] = sortedColors.map(([color, count]) => ({
            color,
            count,
            percentage: Math.round((count / totalColors) * 100 * 100) / 100,
            format: this.detectColorFormat(color)
          }));
          
          const dominantColor = sortedColors[0]?.[0] || '#000000';
          const palette = sortedColors.map(([color]) => color);
          
          resolve({
            success: true,
            colors: extractedColors,
            dominantColor,
            palette,
            message: `CSSから${extractedColors.length}色のカラー情報を抽出しました`,
            sourceType: 'css',
            extractedAt: new Date()
          });
        } catch (error) {
          resolve({
            success: false,
            colors: [],
            dominantColor: '#000000',
            palette: [],
            message: `CSSファイルの解析中にエラーが発生しました: ${error}`,
            sourceType: 'css',
            extractedAt: new Date()
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          colors: [],
          dominantColor: '#000000',
          palette: [],
          message: 'CSSファイルの読み込みに失敗しました',
          sourceType: 'css',
          extractedAt: new Date()
        });
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * HTMLコンテンツからカラー情報を解析
   */
  private static parseColorsFromHTML(html: string): string[] {
    const colors: string[] = [];
    
    // style属性からカラーを抽出
    const styleRegex = /style\s*=\s*["']([^"']*?)["']/gi;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
      const styleContent = match[1];
      colors.push(...this.parseColorsFromCSS(styleContent));
    }
    
    // <style>タグからカラーを抽出
    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    while ((match = styleTagRegex.exec(html)) !== null) {
      const cssContent = match[1];
      colors.push(...this.parseColorsFromCSS(cssContent));
    }
    
    // 色属性から抽出（古いHTML）
    const colorAttrRegex = /(?:color|bgcolor)\s*=\s*["']([^"']*?)["']/gi;
    while ((match = colorAttrRegex.exec(html)) !== null) {
      const color = match[1].trim();
      if (this.isValidColor(color)) {
        colors.push(color);
      }
    }
    
    return colors;
  }

  /**
   * CSSコンテンツからカラー情報を解析
   */
  private static parseColorsFromCSS(css: string): string[] {
    const colors: string[] = [];
    
    // HEXカラー (#rrggbb, #rgb)
    const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
    let match;
    while ((match = hexRegex.exec(css)) !== null) {
      colors.push(match[0]);
    }
    
    // RGB/RGBA カラー
    const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/gi;
    while ((match = rgbRegex.exec(css)) !== null) {
      colors.push(match[0]);
    }
    
    // HSL/HSLA カラー
    const hslRegex = /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)/gi;
    while ((match = hslRegex.exec(css)) !== null) {
      colors.push(match[0]);
    }
    
    // CSS カラー名
    const colorNameRegex = /\b(red|green|blue|yellow|orange|purple|pink|brown|black|white|gray|grey|silver|gold|navy|teal|lime|magenta|cyan|maroon|olive|aqua|fuchsia|crimson|coral|salmon|khaki|plum|orchid|violet|turquoise|indigo|beige|tan|ivory|lavender|azure|snow|ghostwhite|whitesmoke|gainsboro|lightgray|darkgray|dimgray|lightslategray|slategray|darkslategray|lightsteelblue|steelblue|lightblue|skyblue|deepskyblue|dodgerblue|cornflowerblue|royalblue|mediumblue|darkblue|midnightblue|lightcyan|cyan|darkcyan|lightseagreen|mediumseagreen|seagreen|darkseagreen|mediumaquamarine|aquamarine|darkgreen|forestgreen|limegreen|chartreuse|greenyellow|yellowgreen|springgreen|mediumspringgreen|lightgreen|palegreen|darkkhaki|khaki|palegoldenrod|lightyellow|lightgoldenrodyellow|lemonchiffon|wheat|burlywood|tan|rosybrown|sandybrown|goldenrod|peru|chocolate|saddlebrown|sienna|brown|maroon|darkolivegreen|olive|olivedrab|mediumorchid|darkorchid|darkviolet|blueviolet|mediumpurple|thistle|plum|violet|orchid|mediumvioletred|palevioletred|deeppink|hotpink|lightpink|pink|mistyrose|lavenderblush|peachpuff|navajowhite|moccasin|cornsilk|ivory|lemonchiffon|seashell|honeydew|mintcream|azure|aliceblue|lavender|lightsteelblue|lightslategray|slategray|lightgray|silver|darkgray|gray|dimgray|lightslategray|slategray|darkslategray|black)\b/gi;
    while ((match = colorNameRegex.exec(css)) !== null) {
      colors.push(match[0]);
    }
    
    return colors;
  }

  /**
   * カラー形式を検出
   */
  private static detectColorFormat(color: string): 'hex' | 'rgb' | 'hsl' {
    if (color.startsWith('#')) return 'hex';
    if (color.startsWith('rgb')) return 'rgb';
    if (color.startsWith('hsl')) return 'hsl';
    return 'hex'; // CSS名前などのデフォルト
  }

  /**
   * 有効なカラー値かチェック
   */
  private static isValidColor(color: string): boolean {
    // 基本的なカラー形式のチェック
    const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)$/;
    const hslRegex = /^hsla?\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(?:,\s*[\d.]+)?\s*\)$/;
    
    return hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color);
  }

  /**
   * 色の類似性を計算（RGB空間での距離）
   */
  static calculateColorSimilarity(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // 最大距離は√(255² × 3) ≈ 441.67
    const maxDistance = Math.sqrt(255 * 255 * 3);
    return Math.max(0, 100 - (distance / maxDistance) * 100);
  }

  /**
   * HEXからRGBに変換
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * 補色を計算
   */
  static getComplementaryColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    
    const complementaryR = 255 - rgb.r;
    const complementaryG = 255 - rgb.g;
    const complementaryB = 255 - rgb.b;
    
    return `#${complementaryR.toString(16).padStart(2, '0')}${complementaryG.toString(16).padStart(2, '0')}${complementaryB.toString(16).padStart(2, '0')}`;
  }

  /**
   * アナログカラーを生成
   */
  static getAnalogousColors(hexColor: string, count: number = 3): string[] {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return [hexColor];
    
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const hueOffset = (i - Math.floor(count / 2)) * 30; // 30度ずつずらす
      const newHue = (hsl.h + hueOffset + 360) % 360;
      const newRgb = this.hslToRgb(newHue, hsl.s, hsl.l);
      const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`;
      colors.push(newHex);
    }
    
    return colors;
  }

  /**
   * RGBからHSLに変換
   */
  private static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }

      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * HSLからRGBに変換
   */
  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
} 