/**
 * 新字体→旧字体変換辞書
 * TestData Buddy - 旧字体変換ツール用
 */

// 新字体 → 旧字体の変換マッピング
export const SHIN_TO_KYU_KANJI: Record<string, string> = {
  // 常用漢字の主要な新旧字体
  '亜': '亞',
  '悪': '惡',
  '圧': '壓',
  '囲': '圍',
  '為': '爲',
  '医': '醫',
  '壱': '壹',
  '稲': '稻',
  '飲': '飮',
  '営': '營',
  '円': '圓',
  '塩': '鹽',
  '欧': '歐',
  '応': '應',
  '黄': '黃',
  '温': '溫',
  '画': '畫',
  '会': '會',
  '海': '海',
  '学': '學',
  '楽': '樂',
  '勧': '勸',
  '関': '關',
  '観': '觀',
  '顔': '顏',
  '器': '器',
  '帰': '歸',
  '気': '氣',
  '既': '既',
  '祈': '祈',
  '起': '起',
  '級': '級',
  '旧': '舊',
  '強': '強',
  '業': '業',
  '近': '近',
  '金': '金',
  '銀': '銀',
  '区': '區',
  '経': '經',
  '継': '繼',
  '芸': '藝',
  '欠': '缺',
  '権': '權',
  '献': '獻',
  '険': '險',
  '検': '檢',
  '厳': '嚴',
  '広': '廣',
  '恒': '恆',
  '国': '國',
  '黒': '黑',
  '今': '今',
  '根': '根',
  '混': '混',
  '細': '細',
  '済': '濟',
  '雑': '雜',
  '参': '參',
  '残': '殘',
  '子': '子',
  '糸': '糸',
  '実': '實',
  '写': '寫',
  '社': '社',
  '者': '者',
  '取': '取',
  '収': '收',
  '従': '從',
  '処': '處',
  '将': '將',
  '称': '稱',
  '条': '條',
  '状': '狀',
  '乗': '乘',
  '浄': '淨',
  '真': '真',
  '神': '神',
  '図': '圖',
  '数': '數',
  '制': '制',
  '政': '政',
  '声': '聲',
  '青': '青',
  '税': '稅',
  '説': '說',
  '戦': '戰',
  '選': '選',
  '総': '總',
  '蔵': '藏',
  '属': '屬',
  '続': '續',
  '体': '體',
  '対': '對',
  '台': '臺',
  '択': '擇',
  '単': '單',
  '団': '團',
  '断': '斷',
  '担': '擔',
  '値': '値',
  '調': '調',
  '鳥': '鳥',
  '直': '直',
  '通': '通',
  '鉄': '鐵',
  '転': '轉',
  '点': '點',
  '電': '電',
  '当': '當',
  '東': '東',
  '読': '讀',
  '内': '內',
  '南': '南',
  '日': '日',
  '入': '入',
  '認': '認',
  '熱': '熱',
  '能': '能',
  '売': '賣',
  '発': '發',
  '反': '反',
  '犯': '犯',
  '晩': '晚',
  '備': '備',
  '美': '美',
  '費': '費',
  '秘': '祕',
  '評': '評',
  '表': '表',
  '病': '病',
  '品': '品',
  '不': '不',
  '婦': '婦',
  '付': '付',
  '府': '府',
  '物': '物',
  '分': '分',
  '文': '文',
  '聞': '聞',
  '弁': '辯',
  '保': '保',
  '歩': '步',
  '宝': '寶',
  '方': '方',
  '毎': '每',
  '万': '萬',
  '満': '滿',
  '味': '味',
  '未': '未',
  '民': '民',
  '無': '無',
  '名': '名',
  '面': '面',
  '黙': '默',
  '問': '問',
  '門': '門',
  '夜': '夜',
  '野': '野',
  '訳': '譯',
  '薬': '藥',
  '様': '樣',
  '要': '要',
  '用': '用',
  '来': '來',
  '礼': '禮',
  '例': '例',
  '連': '連',
  '老': '老',
  '労': '勞',
  '録': '錄',
  '話': '話',
  
  // 人名・地名でよく使われる字
  '沢': '澤',
  '渡': '渡',
  '辺': '邊',
  '浜': '濱',
  '島': '嶋',
  '崎': '﨑',
  '田': '田',
  '山': '山',
  '川': '川',
  '中': '中',
  '小': '小',
  '大': '大',
  '高': '高',
  '木': '木',
  '林': '林',
  '森': '森',
  '石': '石',
  '竹': '竹',
  '藤': '藤',
  '佐': '佐',
  '加': '加',
  
  // 頻出字の追加
  '龍': '龍',
  '竜': '龍',
  '恵': '惠',
  '慧': '慧',
  '輝': '輝',
  '豊': '豐',
  '栄': '榮',
  '衛': '衞',
  '英': '英',
  '雄': '雄',
  '徳': '德',
  '福': '福',
  '富': '富',
  '康': '康',
  '健': '健',
  '智': '智',
  '聡': '聰',
  '明': '明',
  '清': '清',
  '正': '正',
  '義': '義',
  '仁': '仁',
  '信': '信',
  '忠': '忠',
  '孝': '孝'
};

// 旧字体 → 新字体の変換マッピング（逆引き用）
export const KYU_TO_SHIN_KANJI: Record<string, string> = Object.fromEntries(
  Object.entries(SHIN_TO_KYU_KANJI).map(([shin, kyu]) => [kyu, shin])
);

/**
 * 新字体を旧字体に変換
 */
export function convertToKyuKanji(text: string): {
  converted: string;
  conversions: Array<{ position: number; from: string; to: string }>;
  totalConversions: number;
} {
  let converted = '';
  const conversions: Array<{ position: number; from: string; to: string }> = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const kyuChar = SHIN_TO_KYU_KANJI[char];
    
    if (kyuChar && kyuChar !== char) {
      converted += kyuChar;
      conversions.push({
        position: i,
        from: char,
        to: kyuChar
      });
    } else {
      converted += char;
    }
  }
  
  return {
    converted,
    conversions,
    totalConversions: conversions.length
  };
}

/**
 * 旧字体を新字体に変換
 */
export function convertToShinKanji(text: string): {
  converted: string;
  conversions: Array<{ position: number; from: string; to: string }>;
  totalConversions: number;
} {
  let converted = '';
  const conversions: Array<{ position: number; from: string; to: string }> = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const shinChar = KYU_TO_SHIN_KANJI[char];
    
    if (shinChar && shinChar !== char) {
      converted += shinChar;
      conversions.push({
        position: i,
        from: char,
        to: shinChar
      });
    } else {
      converted += char;
    }
  }
  
  return {
    converted,
    conversions,
    totalConversions: conversions.length
  };
}

/**
 * テキスト内の変換可能な漢字を検出
 */
export function detectConvertibleKanji(text: string): {
  shinToKyu: Array<{ position: number; char: string; convertTo: string }>;
  kyuToShin: Array<{ position: number; char: string; convertTo: string }>;
} {
  const shinToKyu: Array<{ position: number; char: string; convertTo: string }> = [];
  const kyuToShin: Array<{ position: number; char: string; convertTo: string }> = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // 新字体→旧字体変換可能
    if (SHIN_TO_KYU_KANJI[char] && SHIN_TO_KYU_KANJI[char] !== char) {
      shinToKyu.push({
        position: i,
        char,
        convertTo: SHIN_TO_KYU_KANJI[char]
      });
    }
    
    // 旧字体→新字体変換可能
    if (KYU_TO_SHIN_KANJI[char] && KYU_TO_SHIN_KANJI[char] !== char) {
      kyuToShin.push({
        position: i,
        char,
        convertTo: KYU_TO_SHIN_KANJI[char]
      });
    }
  }
  
  return { shinToKyu, kyuToShin };
}

/**
 * 対応する字体があるかチェック
 */
export function hasCorrespondingKanji(char: string): {
  hasKyu: boolean;
  hasShin: boolean;
  kyuForm?: string;
  shinForm?: string;
} {
  const kyuForm = SHIN_TO_KYU_KANJI[char];
  const shinForm = KYU_TO_SHIN_KANJI[char];
  
  return {
    hasKyu: !!kyuForm && kyuForm !== char,
    hasShin: !!shinForm && shinForm !== char,
    kyuForm: kyuForm || undefined,
    shinForm: shinForm || undefined
  };
}

// 人名によく使われる漢字（旧字体あり）
export const COMMON_NAME_KANJI = [
  // 姓によく使われる
  '佐', '田', '山', '川', '高', '橋', '木', '井', '松', '野', 
  '中', '小', '大', '石', '竹', '金', '森', '林', '清', '藤',
  '渡', '加', '近', '遠', '新', '古', '青', '黒', '白', '赤',
  '東', '西', '南', '北', '上', '下', '前', '後', '内', '外',
  
  // 名前によく使われる  
  '太', '郎', '一', '二', '三', '四', '五', '六', '七', '八',
  '美', '子', '花', '愛', '恵', '香', '里', '奈', '菜', '智',
  '雄', '男', '夫', '雅', '正', '義', '信', '和', '光', '明',
  '健', '康', '幸', '福', '豊', '栄', '誠', '真', '純', '清'
];

// ファイル名・システム名によく使われる漢字
export const COMMON_FILENAME_KANJI = [
  // システム・業務関連
  '管', '理', '設', '定', '構', '成', '情', '報', '処', '理',
  '入', '力', '出', '力', '変', '換', '検', '索', '登', '録',
  '更', '新', '削', '除', '追', '加', '編', '集', '保', '存',
  '実', '行', '終', '了', '開', '始', '停', '止', '再', '開',
  '送', '信', '受', '信', '通', '知', '警', '告', '確', '認',
  
  // 日付・時間関連
  '年', '月', '日', '時', '分', '秒', '曜', '今', '昨', '明',
  
  // 数量・状態関連  
  '数', '量', '件', '個', '回', '番', '号', '第', '初', '最',
  '全', '部', '分', '半', '完', '了', '未', '済', '中', '断'
];

// ランダムサンプル生成関数
export function generateRandomNameSample(): string {
  const sampleSize = 8;
  const shuffled = [...COMMON_NAME_KANJI].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, sampleSize).join('');
}

export function generateRandomFilenameSample(): string {
  const sampleSize = 10;  
  const shuffled = [...COMMON_FILENAME_KANJI].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, sampleSize).join('');
}

// 変換可能文字の検出
export function detectConvertibleCharacters(text: string): {
  newToOld: string[];
  oldToNew: string[];
} {
  const newToOld: string[] = [];
  const oldToNew: string[] = [];
  
  for (const char of text) {
    if (newToOldKanjiMap[char]) {
      newToOld.push(char);
    }
    if (oldToNewKanjiMap[char]) {
      oldToNew.push(char);
    }
  }
  
  return { newToOld, oldToNew };
} 