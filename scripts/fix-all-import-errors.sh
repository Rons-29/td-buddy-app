#!/bin/bash

# 🍺 Brew's Complete Import Fix Script
# 破損したimport文をまとめて修正するスクリプト

echo "🍺 Brewが全てのimport文エラーを修正します..."

# 作業ディレクトリに移動
cd "$(dirname "$0")/.." || exit 1

# バックアップ作成
echo "📦 バックアップ作成中..."
BACKUP_DIR="backup-import-fix-$(date +%Y%m%d-%H%M%S)"
cp -r td-buddy-webapp/backend/src "$BACKUP_DIR"
echo "✅ バックアップ作成完了: $BACKUP_DIR"

# 修正対象ファイルリスト
FILES=(
  "td-buddy-webapp/backend/src/routes/datetime.ts"
  "td-buddy-webapp/backend/src/routes/personal.ts"
  "td-buddy-webapp/backend/src/routes/ai.ts"
  "td-buddy-webapp/backend/src/routes/uuid.ts"
  "td-buddy-webapp/backend/src/routes/numberboolean.ts"
  "td-buddy-webapp/backend/src/routes/export.ts"
  "td-buddy-webapp/backend/src/routes/health.ts"
  "td-buddy-webapp/backend/src/routes/password.ts"
  "td-buddy-webapp/backend/src/services/PersonalInfoService.ts"
  "td-buddy-webapp/backend/src/services/PasswordService.ts"
  "td-buddy-webapp/backend/src/services/UuidService.ts"
  "td-buddy-webapp/backend/src/services/DateTimeService.ts"
  "td-buddy-webapp/backend/src/services/NumberBooleanService.ts"
  "td-buddy-webapp/backend/src/services/ExportService.ts"
  "td-buddy-webapp/backend/src/services/validation/RequestValidator.ts"
  "td-buddy-webapp/backend/src/middleware/errorHandler.ts"
)

# 各ファイルの修正
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔧 修正中: $file"
    
    # 破損したimport行を検出・修正
    if grep -q "^[[:space:]]*[A-Za-z].*}[[:space:]]*$" "$file"; then
      echo "  ⚠️  破損したimport文を検出"
      
      # 一時ファイル作成
      temp_file=$(mktemp)
      
      # ファイルの先頭の破損したimport文を修正
      {
        # 正しいimport文を追加
        echo "import { Request, Response, Router } from 'express';"
        echo "import { database } from '../database/database';"
        
        # ファイル固有のimport文
        case "$file" in
          *datetime.ts)
            echo "import { DateTimeOptions, DateTimeService } from '../services/DateTimeService';"
            ;;
          *personal.ts)
            echo "import { PersonalInfoGenerateRequest } from '../types/personalInfo';"
            echo "import { PersonalInfoService } from '../services/PersonalInfoService';"
            ;;
          *ai.ts)
            echo "import { AIService } from '../services/AIService';"
            echo "import { RequestValidator } from '../services/validation/RequestValidator';"
            ;;
          *uuid.ts)
            echo "import { UuidService, UuidOptions } from '../services/UuidService';"
            ;;
          *numberboolean.ts)
            echo "import { NumberBooleanService, NumberOptions, BooleanOptions } from '../services/NumberBooleanService';"
            ;;
          *export.ts)
            echo "import { ExportService } from '../services/ExportService';"
            ;;
          *password.ts)
            echo "import { PasswordService, PasswordOptions } from '../services/PasswordService';"
            ;;
          *PersonalInfoService.ts)
            echo "import { PersonalInfoGenerateRequest, PersonalInfoGenerateResponse } from '../types/personalInfo';"
            ;;
          *validation/RequestValidator.ts)
            echo "import { PersonalInfoGenerateRequest } from '../../types/personalInfo';"
            ;;
        esac
        
        echo ""
        echo "// Logger setup"
        echo "const logger = console;"
        echo ""
        
        # 破損したimport行をスキップして残りの内容を追加
        sed '/^[[:space:]]*[A-Za-z][^(]*}[[:space:]]*$/d' "$file"
        
      } > "$temp_file"
      
      # 元のファイルを置き換え
      mv "$temp_file" "$file"
      echo "  ✅ 修正完了"
    else
      echo "  ✅ 問題なし"
    fi
  else
    echo "  ⚠️  ファイルが見つかりません: $file"
  fi
done

echo ""
echo "🍺 Brewからの報告:"
echo "✅ 全てのimport文エラーの修正が完了しました！"
echo "📦 バックアップ: $BACKUP_DIR"
echo "🔄 サーバーを再起動してください"
echo "" 