# 🔄 CI/CD パイプライン設計
# TestData Buddy (TD) Web版 自動化デプロイ戦略

## 🎯 CI/CD 戦略概要

### 自動化の目標
- **品質保証**: 全てのリリースで一貫した品質を保証
- **高速デプロイ**: 機能追加から本番反映まで最短30分
- **安全性**: 段階的デプロイとロールバック機能
- **可視性**: デプロイ状況とメトリクスの完全な可視化

**TDからのメッセージ**: 「自動化で安全かつ高速なリリースを実現しましょう！」

## 🚀 パイプライン全体設計

### パイプライン概要図
```mermaid
graph TB
    Developer[👨‍💻 開発者] --> PR[🔀 Pull Request]
    PR --> CI{🔍 CI Pipeline}
    
    CI --> UnitTest[🧪 Unit Tests]
    CI --> LintCheck[📝 Lint & Format]
    CI --> TypeCheck[🔍 Type Check]
    CI --> SecurityScan[🛡️ Security Scan]
    
    UnitTest --> Integration[🔗 Integration Tests]
    LintCheck --> Integration
    TypeCheck --> Integration
    SecurityScan --> Integration
    
    Integration --> Build[🏗️ Build & Package]
    Build --> DevDeploy[🚀 Dev Environment Deploy]
    
    PR --> Merge{✅ Merge to develop}
    Merge --> StagingPipeline[🎭 Staging Pipeline]
    
    StagingPipeline --> StagingDeploy[🎪 Staging Deploy]
    StagingDeploy --> E2ETests[🤖 E2E Tests]
    E2ETests --> PerformanceTest[⚡ Performance Tests]
    
    PerformanceTest --> Release{🏷️ Release Tag}
    Release --> ProductionPipeline[🏭 Production Pipeline]
    
    ProductionPipeline --> BlueGreenDeploy[🔄 Blue-Green Deploy]
    BlueGreenDeploy --> HealthCheck[❤️ Health Check]
    HealthCheck --> TrafficSwitch[🔀 Traffic Switch]
    
    TrafficSwitch --> Monitor[📊 Monitor & Alert]
```

## 📋 パイプライン詳細設計

### 1. Pull Request パイプライン
```yaml
# .github/workflows/pr-check.yml
name: Pull Request Check

on:
  pull_request:
    branches: [develop, main]
    paths-ignore:
      - 'docs/**'
      - '*.md'

jobs:
  # 基本品質チェック
  quality-check:
    name: Quality Check
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install Dependencies
        run: |
          npm install -g pnpm@8
          pnpm install --frozen-lockfile
      
      - name: Lint Check
        run: |
          pnpm run lint:frontend
          pnpm run lint:backend
      
      - name: Type Check
        run: |
          pnpm run type-check:frontend
          pnpm run type-check:backend
      
      - name: Format Check
        run: |
          pnpm run format:check
      
      - name: Unit Tests
        run: |
          pnpm run test:unit --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: td-buddy-coverage

  # セキュリティチェック
  security-check:
    name: Security Check
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Dependency Vulnerability Scan
        run: |
          npm audit --audit-level=moderate
          pnpm audit --audit-level=moderate
      
      - name: CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: typescript, javascript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
      
      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # ビルドテスト
  build-test:
    name: Build Test
    runs-on: ubuntu-latest
    timeout-minutes: 20
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install Dependencies
        run: |
          npm install -g pnpm@8
          pnpm install --frozen-lockfile
      
      - name: Build Frontend
        run: |
          cd td-buddy-webapp/frontend
          pnpm run build
      
      - name: Build Backend
        run: |
          cd td-buddy-webapp/backend
          pnpm run build
      
      - name: Docker Build Test
        run: |
          docker build -t td-buddy/frontend:test ./td-buddy-webapp/frontend
          docker build -t td-buddy/backend:test ./td-buddy-webapp/backend

  # 統合テスト
  integration-test:
    name: Integration Test
    runs-on: ubuntu-latest
    needs: [quality-check, security-check, build-test]
    timeout-minutes: 30
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: td_buddy_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Test Environment
        run: |
          npm install -g pnpm@8
          pnpm install --frozen-lockfile
          cp .env.test .env
      
      - name: Database Migration
        run: |
          cd td-buddy-webapp/backend
          pnpm run db:migrate:test
      
      - name: Run Integration Tests
        run: |
          pnpm run test:integration
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:test_password@localhost:5432/td_buddy_test
          REDIS_URL: redis://localhost:6379
```

### 2. 開発環境デプロイパイプライン
```yaml
# .github/workflows/dev-deploy.yml
name: Development Deploy

on:
  push:
    branches: [develop]
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-dev:
    name: Deploy to Development
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: development
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
      
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and Push Images
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY_FRONTEND: td-buddy/frontend
          ECR_REPOSITORY_BACKEND: td-buddy/backend
          IMAGE_TAG: dev-${{ github.sha }}
        run: |
          # Frontend Image
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG ./td-buddy-webapp/frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG
          
          # Backend Image  
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG ./td-buddy-webapp/backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          # ECS タスク定義の更新
          aws ecs update-service \
            --cluster td-buddy-dev \
            --service td-buddy-frontend-dev \
            --force-new-deployment
          
          aws ecs update-service \
            --cluster td-buddy-dev \
            --service td-buddy-backend-dev \
            --force-new-deployment
      
      - name: Wait for Deployment
        run: |
          aws ecs wait services-stable \
            --cluster td-buddy-dev \
            --services td-buddy-frontend-dev td-buddy-backend-dev
      
      - name: Health Check
        run: |
          timeout 300 bash -c 'until curl -f https://dev.td-buddy.com/health; do sleep 10; done'
      
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          fields: repo,message,commit,author,action,eventName,ref,workflow
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. ステージング環境パイプライン
```yaml
# .github/workflows/staging-deploy.yml
name: Staging Deploy

on:
  workflow_run:
    workflows: ["Development Deploy"]
    types:
      - completed
    branches: [develop]

jobs:
  staging-tests:
    name: Staging Environment Tests
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    environment: staging
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install Dependencies
        run: |
          npm install -g pnpm@8
          pnpm install --frozen-lockfile
      
      - name: Deploy to Staging
        run: |
          # Staging環境のデプロイスクリプト実行
          ./scripts/deploy-staging.sh
      
      - name: E2E Tests
        run: |
          pnpm run test:e2e:staging
        env:
          E2E_BASE_URL: https://staging.td-buddy.com
          PLAYWRIGHT_BROWSERS_PATH: 0
      
      - name: Performance Tests
        run: |
          pnpm run test:performance:staging
      
      - name: Load Testing
        run: |
          # Artillery.jsでの負荷テスト
          npx artillery run tests/load/staging-load-test.yml
      
      - name: Accessibility Tests
        run: |
          # axe-coreでのアクセシビリティテスト
          pnpm run test:a11y:staging
      
      - name: Visual Regression Tests
        run: |
          # Percy.ioでのビジュアル回帰テスト
          pnpm run test:visual:staging
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
      
      - name: Generate Test Report
        if: always()
        run: |
          # テストレポートの生成
          pnpm run test:report
      
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: staging-test-results
          path: |
            test-results/
            playwright-report/
            coverage/
```

### 4. 本番デプロイパイプライン
```yaml
# .github/workflows/production-deploy.yml
name: Production Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  pre-deploy-validation:
    name: Pre-Deploy Validation
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Validate Release Tag
        run: |
          # セマンティックバージョンの検証
          if [[ ! "${GITHUB_REF#refs/tags/}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version tag format"
            exit 1
          fi
      
      - name: Check Staging Health
        run: |
          curl -f https://staging.td-buddy.com/health
      
      - name: Security Final Check
        run: |
          # 最終セキュリティチェック
          docker run --rm -v $(pwd):/project aquasec/trivy fs /project
      
      - name: Backup Current Production
        run: |
          # 本番環境のバックアップ作成
          ./scripts/backup-production.sh

  blue-green-deploy:
    name: Blue-Green Deployment
    runs-on: ubuntu-latest
    needs: pre-deploy-validation
    environment: production
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID_PROD }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY_PROD }}
          aws-region: ap-northeast-1
      
      - name: Build Production Images
        env:
          IMAGE_TAG: ${{ github.ref_name }}
        run: |
          # マルチステージビルドで本番最適化
          docker build \
            --target production \
            --build-arg NODE_ENV=production \
            -t td-buddy/frontend:$IMAGE_TAG \
            ./td-buddy-webapp/frontend
          
          docker build \
            --target production \
            --build-arg NODE_ENV=production \
            -t td-buddy/backend:$IMAGE_TAG \
            ./td-buddy-webapp/backend
      
      - name: Push to Registry
        run: |
          # ECRにプッシュ
          docker tag td-buddy/frontend:${{ github.ref_name }} \
            $ECR_REGISTRY/td-buddy/frontend:${{ github.ref_name }}
          docker push $ECR_REGISTRY/td-buddy/frontend:${{ github.ref_name }}
          
          docker tag td-buddy/backend:${{ github.ref_name }} \
            $ECR_REGISTRY/td-buddy/backend:${{ github.ref_name }}
          docker push $ECR_REGISTRY/td-buddy/backend:${{ github.ref_name }}
      
      - name: Deploy to Green Environment
        run: |
          # Green環境（新バージョン）のデプロイ
          ./scripts/blue-green-deploy.sh deploy-green ${{ github.ref_name }}
      
      - name: Health Check Green Environment
        run: |
          # Green環境のヘルスチェック
          timeout 600 bash -c '
            until curl -f https://green.td-buddy.com/health; do
              echo "Waiting for green environment..."
              sleep 30
            done
          '
      
      - name: Smoke Tests on Green
        run: |
          # Green環境での最小限の動作確認
          pnpm run test:smoke:green
        env:
          SMOKE_TEST_URL: https://green.td-buddy.com
      
      - name: Traffic Switch (Blue → Green)
        run: |
          # トラフィックをGreen環境に切り替え
          ./scripts/blue-green-deploy.sh switch-traffic ${{ github.ref_name }}
      
      - name: Post-Deploy Validation
        run: |
          # 本番環境での最終確認
          sleep 60  # トラフィック切り替えの安定化待ち
          curl -f https://td-buddy.com/health
          
          # 主要機能の動作確認
          pnpm run test:smoke:production
        env:
          SMOKE_TEST_URL: https://td-buddy.com
      
      - name: Cleanup Blue Environment
        if: success()
        run: |
          # 旧Blue環境のクリーンアップ（15分後）
          sleep 900
          ./scripts/blue-green-deploy.sh cleanup-blue

  post-deploy:
    name: Post Deploy Tasks
    runs-on: ubuntu-latest
    needs: blue-green-deploy
    if: success()
    
    steps:
      - name: Update Monitoring
        run: |
          # 監視ダッシュボードの更新
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.GRAFANA_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"version": "${{ github.ref_name }}", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' \
            https://grafana.td-buddy.com/api/annotations
      
      - name: Create Release Notes
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body_path: ./RELEASE_NOTES.md
          draft: false
          prerelease: false
      
      - name: Notify Stakeholders
        run: |
          # ステークホルダーへの通知
          ./scripts/notify-release.sh ${{ github.ref_name }}
      
      - name: Update Documentation
        run: |
          # ドキュメントサイトの更新
          curl -X POST \
            -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/td-buddy/docs/dispatches \
            -d '{"event_type": "update-docs", "client_payload": {"version": "${{ github.ref_name }}"}}'

  rollback:
    name: Emergency Rollback
    runs-on: ubuntu-latest
    if: failure()
    environment: production
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Rollback to Blue Environment
        run: |
          # 緊急時のBlue環境へのロールバック
          ./scripts/blue-green-deploy.sh rollback
      
      - name: Verify Rollback
        run: |
          # ロールバック後の動作確認
          curl -f https://td-buddy.com/health
      
      - name: Emergency Notification
        run: |
          # 緊急時のアラート送信
          ./scripts/emergency-alert.sh "Production deployment failed, rolled back to previous version"
```

## 🛠️ デプロイメントスクリプト

### Blue-Green デプロイスクリプト
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

COMMAND=$1
VERSION=$2
GREEN_CLUSTER="td-buddy-green"
BLUE_CLUSTER="td-buddy-blue"
LOAD_BALANCER="td-buddy-alb"

echo "🤖 TDのBlue-Greenデプロイメント開始: $COMMAND"

case $COMMAND in
  "deploy-green")
    echo "🟢 Green環境へのデプロイ開始..."
    
    # Green環境のサービス更新
    aws ecs update-service \
      --cluster $GREEN_CLUSTER \
      --service td-buddy-frontend \
      --task-definition td-buddy-frontend:$VERSION \
      --force-new-deployment
    
    aws ecs update-service \
      --cluster $GREEN_CLUSTER \
      --service td-buddy-backend \
      --task-definition td-buddy-backend:$VERSION \
      --force-new-deployment
    
    # デプロイ完了待ち
    echo "⏳ Green環境のデプロイ完了を待機中..."
    aws ecs wait services-stable \
      --cluster $GREEN_CLUSTER \
      --services td-buddy-frontend td-buddy-backend
    
    echo "✅ Green環境のデプロイ完了"
    ;;
    
  "switch-traffic")
    echo "🔀 トラフィックをGreen環境に切り替え中..."
    
    # ALBのターゲットグループをGreenに変更
    GREEN_TARGET_GROUP=$(aws elbv2 describe-target-groups \
      --names td-buddy-green \
      --query 'TargetGroups[0].TargetGroupArn' \
      --output text)
    
    aws elbv2 modify-listener \
      --listener-arn $(aws elbv2 describe-listeners \
        --load-balancer-arn $(aws elbv2 describe-load-balancers \
          --names $LOAD_BALANCER \
          --query 'LoadBalancers[0].LoadBalancerArn' \
          --output text) \
        --query 'Listeners[0].ListenerArn' \
        --output text) \
      --default-actions Type=forward,TargetGroupArn=$GREEN_TARGET_GROUP
    
    echo "✅ トラフィック切り替え完了"
    ;;
    
  "rollback")
    echo "🔙 Blue環境へのロールバック開始..."
    
    # ALBのターゲットグループをBlueに戻す
    BLUE_TARGET_GROUP=$(aws elbv2 describe-target-groups \
      --names td-buddy-blue \
      --query 'TargetGroups[0].TargetGroupArn' \
      --output text)
    
    aws elbv2 modify-listener \
      --listener-arn $(aws elbv2 describe-listeners \
        --load-balancer-arn $(aws elbv2 describe-load-balancers \
          --names $LOAD_BALANCER \
          --query 'LoadBalancers[0].LoadBalancerArn' \
          --output text) \
        --query 'Listeners[0].ListenerArn' \
        --output text) \
      --default-actions Type=forward,TargetGroupArn=$BLUE_TARGET_GROUP
    
    echo "✅ ロールバック完了"
    ;;
    
  "cleanup-blue")
    echo "🧹 Blue環境のクリーンアップ開始..."
    
    # 古いBlue環境のタスク停止
    aws ecs update-service \
      --cluster $BLUE_CLUSTER \
      --service td-buddy-frontend \
      --desired-count 0
    
    aws ecs update-service \
      --cluster $BLUE_CLUSTER \
      --service td-buddy-backend \
      --desired-count 0
    
    echo "✅ Blue環境のクリーンアップ完了"
    ;;
    
  *)
    echo "❌ 不正なコマンド: $COMMAND"
    echo "使用方法: $0 {deploy-green|switch-traffic|rollback|cleanup-blue} [version]"
    exit 1
    ;;
esac

echo "🎉 TDのBlue-Greenデプロイメント完了: $COMMAND"
```

## 📊 モニタリング & アラート

### GitHub Actions監視設定
```yaml
# .github/workflows/pipeline-monitoring.yml
name: Pipeline Monitoring

on:
  workflow_run:
    workflows: ["*"]
    types:
      - completed

jobs:
  collect-metrics:
    name: Collect Pipeline Metrics
    runs-on: ubuntu-latest
    
    steps:
      - name: Collect Workflow Metrics
        run: |
          # パイプライン実行時間の記録
          WORKFLOW_RUN_ID=${{ github.event.workflow_run.id }}
          DURATION=${{ github.event.workflow_run.run_duration_ms }}
          STATUS=${{ github.event.workflow_run.conclusion }}
          
          # Prometheusメトリクスとして送信
          curl -X POST http://pushgateway.td-buddy.com:9091/metrics/job/github-actions \
            -d "pipeline_duration_seconds{workflow=\"${{ github.event.workflow_run.name }}\",status=\"$STATUS\"} $(($DURATION / 1000))"
          
          curl -X POST http://pushgateway.td-buddy.com:9091/metrics/job/github-actions \
            -d "pipeline_runs_total{workflow=\"${{ github.event.workflow_run.name }}\",status=\"$STATUS\"} 1"
      
      - name: Alert on Failure
        if: github.event.workflow_run.conclusion == 'failure'
        run: |
          # 失敗時のアラート送信
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{
              "text": "🚨 Pipeline Failed",
              "attachments": [{
                "color": "danger",
                "fields": [
                  {"title": "Workflow", "value": "${{ github.event.workflow_run.name }}", "short": true},
                  {"title": "Branch", "value": "${{ github.event.workflow_run.head_branch }}", "short": true},
                  {"title": "Commit", "value": "${{ github.event.workflow_run.head_sha }}", "short": true}
                ]
              }]
            }'
```

### パフォーマンス監視
```typescript
// scripts/performance-monitor.ts
export interface DeploymentMetrics {
  deploymentDuration: number;
  healthCheckTime: number;
  rollbackTime?: number;
  errorRate: number;
  responseTime: number;
}

export class DeploymentMonitor {
  async recordDeployment(version: string, metrics: DeploymentMetrics): Promise<void> {
    // メトリクスの記録
    await this.sendToDatadog({
      metric: 'deployment.duration',
      value: metrics.deploymentDuration,
      tags: [`version:${version}`, 'environment:production'],
    });
    
    await this.sendToDatadog({
      metric: 'deployment.health_check_time',
      value: metrics.healthCheckTime,
      tags: [`version:${version}`, 'environment:production'],
    });
    
    // SLI/SLO の計算
    const deploymentSuccess = metrics.errorRate < 0.01; // 1%以下
    const deploymentSpeed = metrics.deploymentDuration < 1800; // 30分以下
    
    await this.updateSLO('deployment_success_rate', deploymentSuccess);
    await this.updateSLO('deployment_speed', deploymentSpeed);
  }
  
  async checkPostDeploymentHealth(): Promise<boolean> {
    const checks = [
      this.checkAPIHealth(),
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkExternalDependencies(),
    ];
    
    const results = await Promise.all(checks);
    return results.every(result => result === true);
  }
}
```

## 🔧 環境別設定管理

### 環境設定ファイル
```typescript
// config/environments.ts
export const environments = {
  development: {
    api: {
      baseURL: 'http://localhost:3001',
      timeout: 10000,
    },
    database: {
      url: 'postgresql://dev_user:dev_pass@localhost:5432/td_buddy_dev',
      pool: { min: 2, max: 10 },
    },
    redis: {
      url: 'redis://localhost:6379',
    },
    monitoring: {
      enabled: false,
    },
  },
  
  staging: {
    api: {
      baseURL: 'https://api-staging.td-buddy.com',
      timeout: 5000,
    },
    database: {
      url: process.env.DATABASE_URL_STAGING,
      pool: { min: 5, max: 20 },
    },
    redis: {
      url: process.env.REDIS_URL_STAGING,
    },
    monitoring: {
      enabled: true,
      level: 'debug',
    },
  },
  
  production: {
    api: {
      baseURL: 'https://api.td-buddy.com',
      timeout: 3000,
    },
    database: {
      url: process.env.DATABASE_URL_PRODUCTION,
      pool: { min: 10, max: 50 },
      ssl: { rejectUnauthorized: false },
    },
    redis: {
      url: process.env.REDIS_URL_PRODUCTION,
      cluster: true,
    },
    monitoring: {
      enabled: true,
      level: 'info',
      sampling: 0.1, // 10%サンプリング
    },
  },
};
```

### シークレット管理
```bash
# scripts/setup-secrets.sh
#!/bin/bash

ENV=$1

if [ -z "$ENV" ]; then
    echo "Usage: $0 {dev|staging|prod}"
    exit 1
fi

echo "🔐 TDのシークレット設定: $ENV環境"

case $ENV in
  "dev")
    # 開発環境のシークレット設定
    kubectl create secret generic td-buddy-secrets \
      --from-literal=database-password="dev_password" \
      --from-literal=redis-password="dev_redis_pass" \
      --from-literal=claude-api-key="$CLAUDE_API_KEY_DEV" \
      --namespace=td-buddy-dev
    ;;
    
  "staging")
    # ステージング環境のシークレット設定
    kubectl create secret generic td-buddy-secrets \
      --from-literal=database-password="$DATABASE_PASSWORD_STAGING" \
      --from-literal=redis-password="$REDIS_PASSWORD_STAGING" \
      --from-literal=claude-api-key="$CLAUDE_API_KEY_STAGING" \
      --namespace=td-buddy-staging
    ;;
    
  "prod")
    # 本番環境のシークレット設定（AWS Secrets Manager使用）
    aws secretsmanager create-secret \
      --name "td-buddy/production/database" \
      --description "TD Buddy Production Database Credentials" \
      --secret-string "{\"password\":\"$DATABASE_PASSWORD_PROD\"}"
    
    aws secretsmanager create-secret \
      --name "td-buddy/production/redis" \
      --description "TD Buddy Production Redis Credentials" \
      --secret-string "{\"password\":\"$REDIS_PASSWORD_PROD\"}"
    
    aws secretsmanager create-secret \
      --name "td-buddy/production/claude" \
      --description "TD Buddy Production Claude API Key" \
      --secret-string "{\"api_key\":\"$CLAUDE_API_KEY_PROD\"}"
    ;;
esac

echo "✅ シークレット設定完了: $ENV環境"
```

## 📈 メトリクス & SLI/SLO

### デプロイメントSLI/SLO
```yaml
# monitoring/sli-slo.yml
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: td-buddy-deployment
  namespace: monitoring
spec:
  service: "td-buddy"
  labels:
    team: "platform"
  slos:
    - name: "deployment-success-rate"
      objective: 99.0  # 99%の成功率
      description: "Deployment success rate over 30 days"
      sli:
        events:
          error_query: 'increase(deployment_failures_total[5m])'
          total_query: 'increase(deployment_attempts_total[5m])'
      alerting:
        name: DeploymentSuccessRate
        labels:
          severity: critical
        annotations:
          summary: "Deployment success rate is below target"
    
    - name: "deployment-duration"
      objective: 95.0  # 95%のデプロイが30分以内
      description: "Deployment duration SLO"
      sli:
        events:
          error_query: 'increase(deployment_duration_bucket{le="1800"}[5m])'
          total_query: 'increase(deployment_duration_count[5m])'
      alerting:
        name: DeploymentDuration
        labels:
          severity: warning
        annotations:
          summary: "Deployment duration is exceeding target"
    
    - name: "rollback-time"
      objective: 99.5  # 99.5%のロールバックが5分以内
      description: "Rollback time SLO"
      sli:
        events:
          error_query: 'increase(rollback_duration_bucket{le="300"}[5m])'
          total_query: 'increase(rollback_duration_count[5m])'
```

## 🎯 継続的改善

### パイプライン最適化の指標
```typescript
// scripts/pipeline-analytics.ts
export interface PipelineAnalytics {
  averageDeployTime: number;
  successRate: number;
  rollbackFrequency: number;
  testCoverage: number;
  buildTime: number;
}

export class PipelineOptimizer {
  async analyzePipelinePerformance(): Promise<PipelineAnalytics> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const deployments = await this.getDeployments(last30Days);
    
    return {
      averageDeployTime: this.calculateAverageDeployTime(deployments),
      successRate: this.calculateSuccessRate(deployments),
      rollbackFrequency: this.calculateRollbackFrequency(deployments),
      testCoverage: await this.getTestCoverage(),
      buildTime: await this.getAverageBuildTime(),
    };
  }
  
  async generateOptimizationReport(): Promise<string> {
    const analytics = await this.analyzePipelinePerformance();
    
    const recommendations: string[] = [];
    
    if (analytics.averageDeployTime > 1800) { // 30分以上
      recommendations.push('デプロイ時間の最適化が必要：並列化の検討');
    }
    
    if (analytics.successRate < 0.95) { // 95%以下
      recommendations.push('テスト品質の向上が必要：テストケースの追加');
    }
    
    if (analytics.rollbackFrequency > 0.05) { // 5%以上
      recommendations.push('事前テストの強化が必要：ステージング環境の改善');
    }
    
    return recommendations.join('\n');
  }
}
```

---

## 🎉 TDからの総括メッセージ

```
🤖 「CI/CDパイプラインの設計が完了しました！

🔄 自動化されたパイプラインで安全なリリースを実現
⚡ 高速なフィードバックループで開発効率向上
🛡️ 段階的デプロイとロールバックで安全性確保
📊 継続的な監視と改善で品質維持

これで安心してWeb版をリリースし、継続的に改善していけますね！
TDがパイプラインも一緒に監視してサポートします♪

次は実際のインフラ構築に進みましょう！」
```

**次のステップ**: インフラ構築とセキュリティ強化の実装を進めましょう！ 