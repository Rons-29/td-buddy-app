/**
 * 国際化（i18n）対応システム
 * QA Workbench (TD) - Internationalization System
 */

export type SupportedLanguage = 'ja' | 'en' | 'zh-CN' | 'ko';

export interface TranslationKeys {
  // 基本的なUI要素
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    copy: string;
    download: string;
    upload: string;
    search: string;
    clear: string;
    reset: string;
    confirm: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // CSV関連
  csv: {
    title: string;
    subtitle: string;
    columnName: string;
    dataType: string;
    settings: string;
    rowCount: string;
    preview: string;
    generate: string;
    downloadCsv: string;
    copyToClipboard: string;
    addColumn: string;
    removeColumn: string;
    selectDataType: string;
    previewData: string;
    noPreviewData: string;
    generateSuccess: string;
    copySuccess: string;
    importCsv: string;
    exportCsv: string;
    saveTemplate: string;
    loadTemplate: string;
  };

  // データ型
  dataTypes: {
    text: string;
    number: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    age: string;
  };

  // TDメッセージ
  brewMessages: {
    greeting: string;
    dataGenerationComplete: string;
    errorSupport: string;
    qualityCheck: string;
    securityCheck: string;
    optimizationSuggestion: string;
    batchProcessingStart: string;
    batchProcessingComplete: string;
    templateSaved: string;
    templateLoaded: string;
  };

  // エラーメッセージ
  errors: {
    invalidInput: string;
    fileTooBig: string;
    networkError: string;
    memoryError: string;
    permissionDenied: string;
    unexpectedError: string;
    validationFailed: string;
    templateNotFound: string;
    quotaExceeded: string;
  };

  // バッチ処理
  batch: {
    title: string;
    jobName: string;
    priority: string;
    status: string;
    progress: string;
    startTime: string;
    estimatedTime: string;
    addJob: string;
    cancelJob: string;
    clearCompleted: string;
    downloadAll: string;
    statusPending: string;
    statusRunning: string;
    statusCompleted: string;
    statusFailed: string;
    statusCancelled: string;
  };

  // テンプレート
  templates: {
    title: string;
    builtIn: string;
    custom: string;
    category: string;
    description: string;
    usage: string;
    createNew: string;
    editTemplate: string;
    deleteTemplate: string;
    importTemplate: string;
    exportTemplate: string;
    searchTemplates: string;
    noTemplatesFound: string;
    templateSaveSuccess: string;
    templateDeleteSuccess: string;
  };
}

/**
 * 言語別翻訳データ
 */
const translations: Record<SupportedLanguage, TranslationKeys> = {
  ja: {
    common: {
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      edit: '編集',
      add: '追加',
      remove: '削除',
      copy: 'コピー',
      download: 'ダウンロード',
      upload: 'アップロード',
      search: '検索',
      clear: 'クリア',
      reset: 'リセット',
      confirm: '確認',
      close: '閉じる',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      warning: '警告',
      info: '情報',
    },
    csv: {
      title: 'CSV詳細データ醸造',
      subtitle: 'テストデータ醸造ツール',
      columnName: '列名',
      dataType: 'データ型',
      settings: '設定',
      rowCount: '生成件数',
      preview: 'プレビュー',
      generate: '生成',
      downloadCsv: 'CSVダウンロード',
      copyToClipboard: 'クリップボードにコピー',
      addColumn: '列を追加',
      removeColumn: '列を削除',
      selectDataType: 'データ型を選択',
      previewData: 'データプレビュー',
      noPreviewData: 'プレビューデータがありません',
      generateSuccess: 'データ醸造が完了しました',
      copySuccess: 'クリップボードにコピーしました',
      importCsv: 'CSVインポート',
      exportCsv: 'CSVエクスポート',
      saveTemplate: 'テンプレート保存',
      loadTemplate: 'テンプレート読み込み',
    },
    dataTypes: {
      text: 'テキスト',
      number: '数値',
      name: '名前',
      email: 'メールアドレス',
      phone: '電話番号',
      date: '日付',
      age: '年齢',
    },
    brewMessages: {
      greeting: 'こんにちは！TDと一緒にテストデータを作りましょう♪',
      dataGenerationComplete:
        'データ醸造が完了しました！品質チェックもOKです✨',
      errorSupport: '問題が発生しました。TDがサポートします',
      qualityCheck: '品質チェック完了！',
      securityCheck: 'セキュリティチェック完了！',
      optimizationSuggestion: 'パフォーマンス最適化の提案があります',
      batchProcessingStart: 'バッチ処理を開始します',
      batchProcessingComplete: 'すべてのバッチ処理が完了しました！',
      templateSaved: 'テンプレートを保存しました',
      templateLoaded: 'テンプレートを読み込みました',
    },
    errors: {
      invalidInput: '入力値が正しくありません',
      fileTooBig: 'ファイルサイズが大きすぎます',
      networkError: 'ネットワークエラーが発生しました',
      memoryError: 'メモリ不足です',
      permissionDenied: 'アクセス権限がありません',
      unexpectedError: '予期しないエラーが発生しました',
      validationFailed: 'バリデーションに失敗しました',
      templateNotFound: 'テンプレートが見つかりません',
      quotaExceeded: '制限を超過しました',
    },
    batch: {
      title: 'バッチ処理',
      jobName: 'ジョブ名',
      priority: '優先度',
      status: 'ステータス',
      progress: '進捗',
      startTime: '開始時刻',
      estimatedTime: '予想残り時間',
      addJob: 'ジョブ追加',
      cancelJob: 'キャンセル',
      clearCompleted: '完了済みクリア',
      downloadAll: '一括ダウンロード',
      statusPending: '待機中',
      statusRunning: '実行中',
      statusCompleted: '完了',
      statusFailed: '失敗',
      statusCancelled: 'キャンセル済み',
    },
    templates: {
      title: 'テンプレート管理',
      builtIn: '内蔵テンプレート',
      custom: 'カスタムテンプレート',
      category: 'カテゴリ',
      description: '説明',
      usage: '使用回数',
      createNew: '新規作成',
      editTemplate: 'テンプレート編集',
      deleteTemplate: 'テンプレート削除',
      importTemplate: 'テンプレートインポート',
      exportTemplate: 'テンプレートエクスポート',
      searchTemplates: 'テンプレート検索',
      noTemplatesFound: 'テンプレートが見つかりません',
      templateSaveSuccess: 'テンプレートを保存しました',
      templateDeleteSuccess: 'テンプレートを削除しました',
    },
  },

  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      copy: 'Copy',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      clear: 'Clear',
      reset: 'Reset',
      confirm: 'Confirm',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
    },
    csv: {
      title: 'CSV Advanced Data Generation',
      subtitle: 'Test Data Generation Tool',
      columnName: 'Column Name',
      dataType: 'Data Type',
      settings: 'Settings',
      rowCount: 'Row Count',
      preview: 'Preview',
      generate: 'Generate',
      downloadCsv: 'Download CSV',
      copyToClipboard: 'Copy to Clipboard',
      addColumn: 'Add Column',
      removeColumn: 'Remove Column',
      selectDataType: 'Select Data Type',
      previewData: 'Data Preview',
      noPreviewData: 'No preview data available',
      generateSuccess: 'Data generation completed',
      copySuccess: 'Copied to clipboard',
      importCsv: 'Import CSV',
      exportCsv: 'Export CSV',
      saveTemplate: 'Save Template',
      loadTemplate: 'Load Template',
    },
    dataTypes: {
      text: 'Text',
      number: 'Number',
      name: 'Name',
      email: 'Email Address',
      phone: 'Phone Number',
      date: 'Date',
      age: 'Age',
    },
    brewMessages: {
      greeting: "Hello! Let's create test data together with TD ♪",
      dataGenerationComplete: 'Data generation completed! Quality check OK ✨',
      errorSupport: 'An issue occurred. TD will support you',
      qualityCheck: 'Quality check completed!',
      securityCheck: 'Security check completed!',
      optimizationSuggestion: 'Performance optimization suggestions available',
      batchProcessingStart: 'Starting batch processing',
      batchProcessingComplete: 'All batch processing completed!',
      templateSaved: 'Template saved',
      templateLoaded: 'Template loaded',
    },
    errors: {
      invalidInput: 'Invalid input value',
      fileTooBig: 'File size too large',
      networkError: 'Network error occurred',
      memoryError: 'Insufficient memory',
      permissionDenied: 'Access permission denied',
      unexpectedError: 'Unexpected error occurred',
      validationFailed: 'Validation failed',
      templateNotFound: 'Template not found',
      quotaExceeded: 'Quota exceeded',
    },
    batch: {
      title: 'Batch Processing',
      jobName: 'Job Name',
      priority: 'Priority',
      status: 'Status',
      progress: 'Progress',
      startTime: 'Start Time',
      estimatedTime: 'Estimated Time Remaining',
      addJob: 'Add Job',
      cancelJob: 'Cancel',
      clearCompleted: 'Clear Completed',
      downloadAll: 'Download All',
      statusPending: 'Pending',
      statusRunning: 'Running',
      statusCompleted: 'Completed',
      statusFailed: 'Failed',
      statusCancelled: 'Cancelled',
    },
    templates: {
      title: 'Template Management',
      builtIn: 'Built-in Templates',
      custom: 'Custom Templates',
      category: 'Category',
      description: 'Description',
      usage: 'Usage Count',
      createNew: 'Create New',
      editTemplate: 'Edit Template',
      deleteTemplate: 'Delete Template',
      importTemplate: 'Import Template',
      exportTemplate: 'Export Template',
      searchTemplates: 'Search Templates',
      noTemplatesFound: 'No templates found',
      templateSaveSuccess: 'Template saved successfully',
      templateDeleteSuccess: 'Template deleted successfully',
    },
  },

  'zh-CN': {
    common: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      remove: '移除',
      copy: '复制',
      download: '下载',
      upload: '上传',
      search: '搜索',
      clear: '清除',
      reset: '重置',
      confirm: '确认',
      close: '关闭',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
    },
    csv: {
      title: 'CSV高级数据生成',
      subtitle: '测试数据生成工具',
      columnName: '列名',
      dataType: '数据类型',
      settings: '设置',
      rowCount: '行数',
      preview: '预览',
      generate: '生成',
      downloadCsv: '下载CSV',
      copyToClipboard: '复制到剪贴板',
      addColumn: '添加列',
      removeColumn: '删除列',
      selectDataType: '选择数据类型',
      previewData: '数据预览',
      noPreviewData: '无预览数据',
      generateSuccess: '数据生成完成',
      copySuccess: '已复制到剪贴板',
      importCsv: '导入CSV',
      exportCsv: '导出CSV',
      saveTemplate: '保存模板',
      loadTemplate: '加载模板',
    },
    dataTypes: {
      text: '文本',
      number: '数字',
      name: '姓名',
      email: '电子邮件',
      phone: '电话号码',
      date: '日期',
      age: '年龄',
    },
    brewMessages: {
      greeting: '你好！让我们与TD一起创建测试数据吧♪',
      dataGenerationComplete: '数据生成完成！质量检查通过✨',
      errorSupport: '出现问题。TD将为您提供支持',
      qualityCheck: '质量检查完成！',
      securityCheck: '安全检查完成！',
      optimizationSuggestion: '有性能优化建议',
      batchProcessingStart: '开始批处理',
      batchProcessingComplete: '所有批处理完成！',
      templateSaved: '模板已保存',
      templateLoaded: '模板已加载',
    },
    errors: {
      invalidInput: '输入值无效',
      fileTooBig: '文件大小过大',
      networkError: '网络错误',
      memoryError: '内存不足',
      permissionDenied: '访问权限被拒绝',
      unexpectedError: '发生意外错误',
      validationFailed: '验证失败',
      templateNotFound: '模板未找到',
      quotaExceeded: '超出限制',
    },
    batch: {
      title: '批处理',
      jobName: '作业名称',
      priority: '优先级',
      status: '状态',
      progress: '进度',
      startTime: '开始时间',
      estimatedTime: '预计剩余时间',
      addJob: '添加作业',
      cancelJob: '取消',
      clearCompleted: '清除已完成',
      downloadAll: '全部下载',
      statusPending: '等待中',
      statusRunning: '运行中',
      statusCompleted: '已完成',
      statusFailed: '失败',
      statusCancelled: '已取消',
    },
    templates: {
      title: '模板管理',
      builtIn: '内置模板',
      custom: '自定义模板',
      category: '类别',
      description: '描述',
      usage: '使用次数',
      createNew: '新建',
      editTemplate: '编辑模板',
      deleteTemplate: '删除模板',
      importTemplate: '导入模板',
      exportTemplate: '导出模板',
      searchTemplates: '搜索模板',
      noTemplatesFound: '未找到模板',
      templateSaveSuccess: '模板保存成功',
      templateDeleteSuccess: '模板删除成功',
    },
  },

  ko: {
    common: {
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      add: '추가',
      remove: '제거',
      copy: '복사',
      download: '다운로드',
      upload: '업로드',
      search: '검색',
      clear: '지우기',
      reset: '재설정',
      confirm: '확인',
      close: '닫기',
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
      warning: '경고',
      info: '정보',
    },
    csv: {
      title: 'CSV 고급 데이터 생성',
      subtitle: '테스트 데이터 생성 도구',
      columnName: '컬럼명',
      dataType: '데이터 타입',
      settings: '설정',
      rowCount: '행 수',
      preview: '미리보기',
      generate: '생성',
      downloadCsv: 'CSV 다운로드',
      copyToClipboard: '클립보드에 복사',
      addColumn: '컬럼 추가',
      removeColumn: '컬럼 삭제',
      selectDataType: '데이터 타입 선택',
      previewData: '데이터 미리보기',
      noPreviewData: '미리보기 데이터 없음',
      generateSuccess: '데이터 생성 완료',
      copySuccess: '클립보드에 복사됨',
      importCsv: 'CSV 가져오기',
      exportCsv: 'CSV 내보내기',
      saveTemplate: '템플릿 저장',
      loadTemplate: '템플릿 로드',
    },
    dataTypes: {
      text: '텍스트',
      number: '숫자',
      name: '이름',
      email: '이메일 주소',
      phone: '전화번호',
      date: '날짜',
      age: '나이',
    },
    brewMessages: {
      greeting: '안녕하세요! TD와 함께 테스트 데이터를 만들어요♪',
      dataGenerationComplete: '데이터 생성 완료! 품질 검사도 OK✨',
      errorSupport: '문제가 발생했습니다. TD가 지원하겠습니다',
      qualityCheck: '품질 검사 완료!',
      securityCheck: '보안 검사 완료!',
      optimizationSuggestion: '성능 최적화 제안이 있습니다',
      batchProcessingStart: '배치 처리 시작',
      batchProcessingComplete: '모든 배치 처리 완료!',
      templateSaved: '템플릿 저장됨',
      templateLoaded: '템플릿 로드됨',
    },
    errors: {
      invalidInput: '잘못된 입력값',
      fileTooBig: '파일 크기가 너무 큼',
      networkError: '네트워크 오류',
      memoryError: '메모리 부족',
      permissionDenied: '접근 권한 거부',
      unexpectedError: '예상치 못한 오류',
      validationFailed: '유효성 검사 실패',
      templateNotFound: '템플릿을 찾을 수 없음',
      quotaExceeded: '할당량 초과',
    },
    batch: {
      title: '배치 처리',
      jobName: '작업명',
      priority: '우선순위',
      status: '상태',
      progress: '진행률',
      startTime: '시작 시간',
      estimatedTime: '예상 남은 시간',
      addJob: '작업 추가',
      cancelJob: '취소',
      clearCompleted: '완료된 항목 지우기',
      downloadAll: '전체 다운로드',
      statusPending: '대기 중',
      statusRunning: '실행 중',
      statusCompleted: '완료',
      statusFailed: '실패',
      statusCancelled: '취소됨',
    },
    templates: {
      title: '템플릿 관리',
      builtIn: '내장 템플릿',
      custom: '사용자 템플릿',
      category: '카테고리',
      description: '설명',
      usage: '사용 횟수',
      createNew: '새로 만들기',
      editTemplate: '템플릿 편집',
      deleteTemplate: '템플릿 삭제',
      importTemplate: '템플릿 가져오기',
      exportTemplate: '템플릿 내보내기',
      searchTemplates: '템플릿 검색',
      noTemplatesFound: '템플릿을 찾을 수 없음',
      templateSaveSuccess: '템플릿 저장 성공',
      templateDeleteSuccess: '템플릿 삭제 성공',
    },
  },
};

/**
 * 国際化管理クラス
 */
export class I18nManager {
  private static currentLanguage: SupportedLanguage = 'ja';
  private static readonly STORAGE_KEY = 'td_language_preference';

  /**
   * 初期化（ブラウザ設定やストレージから言語を復元）
   */
  static initialize(): void {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') {
      return; // サーバーサイドでは何もしない
    }

    try {
      // ローカルストレージから言語設定を読み込み
      const stored = localStorage.getItem(
        this.STORAGE_KEY
      ) as SupportedLanguage;
      if (stored && this.isValidLanguage(stored)) {
        this.currentLanguage = stored;
        return;
      }

      // ブラウザの言語設定から推測
      const browserLang = navigator.language || 'ja';
      const detectedLang = this.detectLanguageFromBrowser(browserLang);
      this.setLanguage(detectedLang);
    } catch (error) {
      console.warn(
        '🍺 ブリューからの警告: 言語設定の初期化でエラーが発生しました',
        error
      );
      // エラー時はデフォルト言語(ja)を使用
    }
  }

  /**
   * ブラウザ言語からサポート言語を推測
   */
  private static detectLanguageFromBrowser(
    browserLang: string
  ): SupportedLanguage {
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('zh')) return 'zh-CN';
    if (browserLang.startsWith('ko')) return 'ko';
    return 'ja'; // デフォルト
  }

  /**
   * 言語が有効かチェック
   */
  private static isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['ja', 'en', 'zh-CN', 'ko'].includes(lang);
  }

  /**
   * 現在の言語を取得
   */
  static getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * 言語を設定
   */
  static setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;

    // ブラウザ環境でのみ実行
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, language);

        // DOM要素の言語属性を更新
        if (document && document.documentElement) {
          document.documentElement.lang = language;
        }
      } catch (error) {
        console.warn(
          '🍺 ブリューからの警告: 言語設定の保存でエラーが発生しました',
          error
        );
      }
    }

    console.log(`🌐 ブリューからのメッセージ: 言語を${language}に変更しました`);
  }

  /**
   * 翻訳テキストを取得
   */
  static t(key: string): string {
    const keys = key.split('.');
    let current: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // フォールバック（日本語）
        current = translations.ja;
        for (const fallbackKey of keys) {
          if (
            current &&
            typeof current === 'object' &&
            fallbackKey in current
          ) {
            current = current[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key; // キーをそのまま返す
          }
        }
        break;
      }
    }

    return typeof current === 'string' ? current : key;
  }

  /**
   * TDメッセージを言語に応じて生成
   */
  static brewMessage(messageKey: string, params?: Record<string, any>): string {
    let message = this.t(`brewMessages.${messageKey}`);

    // パラメータの置換
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, String(value));
      });
    }

    return message;
  }

  /**
   * 数値のフォーマット（言語に応じて）
   */
  static formatNumber(number: number): string {
    switch (this.currentLanguage) {
      case 'ja':
        return number.toLocaleString('ja-JP');
      case 'en':
        return number.toLocaleString('en-US');
      case 'zh-CN':
        return number.toLocaleString('zh-CN');
      case 'ko':
        return number.toLocaleString('ko-KR');
      default:
        return number.toString();
    }
  }

  /**
   * 日付のフォーマット（言語に応じて）
   */
  static formatDate(date: Date): string {
    switch (this.currentLanguage) {
      case 'ja':
        return date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'en':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'zh-CN':
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'ko':
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      default:
        return date.toISOString().split('T')[0];
    }
  }

  /**
   * 時間のフォーマット（言語に応じて）
   */
  static formatTime(date: Date): string {
    switch (this.currentLanguage) {
      case 'ja':
        return date.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'en':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      case 'zh-CN':
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'ko':
        return date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return date.toTimeString().split(' ')[0].substring(0, 5);
    }
  }

  /**
   * ファイルサイズのフォーマット（言語に応じて）
   */
  static formatFileSize(bytes: number): string {
    const units = {
      ja: ['バイト', 'KB', 'MB', 'GB'],
      en: ['Bytes', 'KB', 'MB', 'GB'],
      'zh-CN': ['字节', 'KB', 'MB', 'GB'],
      ko: ['바이트', 'KB', 'MB', 'GB'],
    };

    const unitList = units[this.currentLanguage] || units.ja;

    if (bytes === 0) return `0 ${unitList[0]}`;

    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1));

    return `${this.formatNumber(size)} ${unitList[i]}`;
  }

  /**
   * サポート言語の一覧を取得
   */
  static getSupportedLanguages(): Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }> {
    return [
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
    ];
  }

  /**
   * RTL（右から左）言語かどうか判定
   */
  static isRTL(): boolean {
    // 現在サポートしている言語にRTL言語はない
    return false;
  }

  /**
   * 言語変更通知のリスナー管理
   */
  private static listeners: Array<(lang: SupportedLanguage) => void> = [];

  static addLanguageChangeListener(
    listener: (lang: SupportedLanguage) => void
  ): void {
    this.listeners.push(listener);
  }

  static removeLanguageChangeListener(
    listener: (lang: SupportedLanguage) => void
  ): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private static notifyLanguageChange(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  /**
   * 言語設定と通知
   */
  static setLanguageWithNotification(language: SupportedLanguage): void {
    this.setLanguage(language);
    this.notifyLanguageChange();
  }
}

/**
 * React Hook用のヘルパー関数
 */
export function useTranslation() {
  return {
    t: I18nManager.t.bind(I18nManager),
    currentLanguage: I18nManager.getCurrentLanguage(),
    setLanguage: I18nManager.setLanguageWithNotification.bind(I18nManager),
    formatNumber: I18nManager.formatNumber.bind(I18nManager),
    formatDate: I18nManager.formatDate.bind(I18nManager),
    formatTime: I18nManager.formatTime.bind(I18nManager),
    formatFileSize: I18nManager.formatFileSize.bind(I18nManager),
    brewMessage: I18nManager.brewMessage.bind(I18nManager),
  };
}

/**
 * Brewキャラクターの多言語対応
 */
export class TDCharacterI18n {
  /**
   * 挨拶メッセージ
   */
  static getGreeting(): string {
    const greetings = {
      ja: 'こんにちは！TDと一緒にテストデータを作りましょう♪',
      en: "Hello! Let's create test data together with TD ♪",
      'zh-CN': '你好！让我们与TD一起创建测试数据吧♪',
      ko: '안녕하세요! TD와 함께 테스트 데이터를 만들어요♪',
    };

    return greetings[I18nManager.getCurrentLanguage()] || greetings.ja;
  }

  /**
   * 励ましメッセージ
   */
  static getEncouragementMessage(): string {
    const messages = {
      ja: '一緒に頑張りましょう！TDがサポートします',
      en: "Let's work together! TD will support you",
      'zh-CN': '让我们一起努力！TD将为您提供支持',
      ko: '함께 힘내요! TD가 지원하겠습니다',
    };

    return messages[I18nManager.getCurrentLanguage()] || messages.ja;
  }

  /**
   * 完了メッセージ
   */
  static getCompletionMessage(): string {
    const messages = {
      ja: 'お疲れさまでした！素晴らしい成果です✨',
      en: 'Great job! Excellent results ✨',
      'zh-CN': '辛苦了！出色的成果✨',
      ko: '수고하셨습니다! 훌륭한 결과입니다✨',
    };

    return messages[I18nManager.getCurrentLanguage()] || messages.ja;
  }
}

// 初期化はuseEffectで適切なタイミングで行われます
