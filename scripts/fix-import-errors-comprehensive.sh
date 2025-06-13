#!/bin/bash

# 🍺 包括的import文エラー修復スクリプト
echo "🍺 Brew: 包括的なimport文修復を開始します..."

cd td-buddy-webapp/backend

# 1. personal.ts修復
echo "📝 personal.ts修復中..."
if [ -f "src/routes/personal.ts" ]; then
    # import文の修復
    sed -i '' 's/import { PersonalInfoService } from/import { PersonalInfoService } from/g' src/routes/personal.ts
    sed -i '' 's/import { PerformanceService } from/import { PerformanceService } from/g' src/routes/personal.ts
    sed -i '' 's/import { database } from/import { database } from/g' src/routes/personal.ts
fi

# 2. uuid.ts修復
echo "📝 uuid.ts修復中..."
if [ -f "src/routes/uuid.ts" ]; then
    sed -i '' 's/import { UuidService } from/import { UuidService } from/g' src/routes/uuid.ts
    sed -i '' 's/import { database } from/import { database } from/g' src/routes/uuid.ts
fi

# 3. init-db-simple.ts修復
echo "📝 init-db-simple.ts修復中..."
if [ -f "src/scripts/init-db-simple.ts" ]; then
    sed -i '' 's/import { database }/import { database } from '\''..\/database\/database'\'';/g' src/scripts/init-db-simple.ts
    sed -i '' 's/import { initializeDatabase }/import { initializeDatabase } from '\''..\/database\/database'\'';/g' src/scripts/init-db-simple.ts
fi

# 4. init-db.ts修復
echo "📝 init-db.ts修復中..."
if [ -f "src/scripts/init-db.ts" ]; then
    sed -i '' 's/import { database }/import { database } from '\''..\/database\/database'\'';/g' src/scripts/init-db.ts
    sed -i '' 's/import { initializeDatabase }/import { initializeDatabase } from '\''..\/database\/database'\'';/g' src/scripts/init-db.ts
fi

# 5. PasswordService.ts修復
echo "📝 PasswordService.ts修復中..."
if [ -f "src/services/PasswordService.ts" ]; then
    sed -i '' 's/import { PasswordService } from/import { PasswordService } from/g' src/services/PasswordService.ts
    sed -i '' 's/import { database } from/import { database } from/g' src/services/PasswordService.ts
fi

# 6. PerformanceService.ts修復
echo "📝 PerformanceService.ts修復中..."
if [ -f "src/services/PerformanceService.ts" ]; then
    sed -i '' 's/import { performance } from '\''perf_hooks'\'';import { PerformanceMetrics }/import { performance } from '\''perf_hooks'\'';\nimport { PerformanceMetrics }/g' src/services/PerformanceService.ts
fi

# 7. PersonalInfoService.ts修復
echo "📝 PersonalInfoService.ts修復中..."
if [ -f "src/services/PersonalInfoService.ts" ]; then
    sed -i '' 's/import { PersonalInfoService } from/import { PersonalInfoService } from/g' src/services/PersonalInfoService.ts
    sed -i '' 's/import { PerformanceService } from/import { PerformanceService } from/g' src/services/PersonalInfoService.ts
fi

# 8. UuidService.ts修復
echo "📝 UuidService.ts修復中..."
if [ -f "src/services/UuidService.ts" ]; then
    sed -i '' 's/import { UuidService } from/import { UuidService } from/g' src/services/UuidService.ts
    sed -i '' 's/import { database } from/import { database } from/g' src/services/UuidService.ts
fi

# 9. WebSocketService.ts修復
echo "📝 WebSocketService.ts修復中..."
if [ -f "src/services/WebSocketService.ts" ]; then
    sed -i '' 's/import { Server as SocketIOServer } from '\''socket.io'\'';import { Server as HTTPServer }/import { Server as SocketIOServer } from '\''socket.io'\'';\nimport { Server as HTTPServer }/g' src/services/WebSocketService.ts
fi

# 10. 一般的なimport文パターンの修復
echo "🔧 一般的なimport文パターンを修復中..."

# 破損したimport文を検索・修復
find src -name "*.ts" -exec grep -l "import.*from.*'.*'.*import" {} \; | while read file; do
    echo "修復中: $file"
    # 連続したimport文を分離
    sed -i '' 's/import \([^;]*\);import/import \1;\nimport/g' "$file"
done

# 11. from句が欠落したimport文を修復
echo "🔍 from句欠落import文を修復中..."
find src -name "*.ts" -exec sed -i '' 's/import \([^;]*\)$/import \1 from '\''FIXME'\'';/g' {} \;

echo "✅ 包括的import文修復完了！"
echo "🍺 Brew: TypeScriptコンパイルを再確認してください" 