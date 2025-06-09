-- TestData Buddy データベース設計

-- ユーザー設定テーブル
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- テンプレート設定テーブル
CREATE TABLE templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'password', 'file', 'personal_info', etc.
    config JSON NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 生成履歴テーブル
CREATE TABLE generation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(100) NOT NULL,
    input_params JSON NOT NULL,
    output_summary TEXT,
    file_path VARCHAR(500),
    execution_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'failed', 'in_progress'
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI プロンプト履歴テーブル
CREATE TABLE ai_prompt_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_prompt TEXT NOT NULL,
    structured_request JSON NOT NULL,
    ai_response JSON,
    generation_id INTEGER,
    execution_time_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_history(id)
);

-- ファイル管理テーブル
CREATE TABLE generated_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    generation_id INTEGER,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_history(id)
);

-- 文字セット定義テーブル
CREATE TABLE character_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    characters TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 旧字体変換マッピングテーブル
CREATE TABLE kanji_conversion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modern_kanji CHAR(1) NOT NULL,
    old_kanji CHAR(3) NOT NULL, -- 旧字体は複数文字の場合がある
    frequency INTEGER DEFAULT 1, -- 使用頻度
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期データ投入
INSERT INTO user_settings (setting_key, setting_value) VALUES
('claude_api_key', ''),
('default_export_path', './data/exports'),
('max_file_size_mb', '100'),
('auto_cleanup_days', '7');

INSERT INTO character_sets (name, characters, description) VALUES
('hiragana', 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん', 'ひらがな文字セット'),
('katakana', 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン', 'カタカナ文字セット'),
('alpha_upper', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '英大文字'),
('alpha_lower', 'abcdefghijklmnopqrstuvwxyz', '英小文字'),
('numeric', '0123456789', '数字'),
('symbols', '!@#$%^&*()_+-=[]{}|;:,.<>?', '記号'),
('emoji', '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠', '絵文字セット');

-- サンプルテンプレート
INSERT INTO templates (name, type, config, is_default) VALUES
('標準パスワード', 'password', '{"length": 12, "includeUpper": true, "includeLower": true, "includeNumbers": true, "includeSymbols": false}', true),
('強力パスワード', 'password', '{"length": 16, "includeUpper": true, "includeLower": true, "includeNumbers": true, "includeSymbols": true}', false),
('基本個人情報', 'personal_info', '{"fields": ["fullName", "email", "phoneNumber", "address"], "locale": "ja"}', true);

-- 旧字体変換の初期データ（サンプル）
INSERT INTO kanji_conversion (modern_kanji, old_kanji, frequency) VALUES
('国', '國', 10),
('学', '學', 10),
('会', '會', 8),
('当', '當', 7),
('来', '來', 9),
('気', '氣', 6),
('時', '時', 5),
('経', '經', 6),
('関', '關', 7),
('発', '發', 8),
('変', '變', 5),
('続', '續', 4),
('帰', '歸', 4),
('庁', '廳', 3),
('応', '應', 5);

-- インデックス作成
CREATE INDEX idx_user_settings_key ON user_settings(setting_key);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_generation_history_type ON generation_history(type);
CREATE INDEX idx_generation_history_created ON generation_history(created_at);
CREATE INDEX idx_ai_prompt_history_generation ON ai_prompt_history(generation_id);
CREATE INDEX idx_generated_files_generation ON generated_files(generation_id);
CREATE INDEX idx_character_sets_name ON character_sets(name);
CREATE INDEX idx_kanji_conversion_modern ON kanji_conversion(modern_kanji); 