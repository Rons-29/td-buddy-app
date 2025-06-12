import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// 🍺 Brew 開発サーバー起動スクリプト
async function startDevServer() {
  console.log(`
🍺 QA Workbench Backend 開発サーバーを起動します！
🎯 ポート: 3000
🛠️ 環境: development
🔄 ホットリロード: 有効
  `);

  try {
    await execAsync("npm run dev");
  } catch (error) {
    console.error("サーバー起動エラー:", error);
  }

  console.log(`
Brewからのメッセージ: 開発準備完了！コード変更時は自動リロードします♪
  `);
}

// Ctrl+C でのサーバー停止処理
process.on("SIGINT", () => {
  console.log("\n🍺 Brew: 開発サーバーを停止します...");
  process.exit(0);
});

// エラーハンドリング
process.on("uncaughtException", (error) => {
  console.error("🚨 予期せぬエラーが発生しました:", error);
  console.log("\n🍺 Brew: 開発サーバーを停止します...");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 未処理のPromise拒否:", reason);
  console.log("\n🍺 Brew: 開発サーバーを停止します...");
  process.exit(1);
});

// 未処理の例外
process.on("uncaughtException", (error) => {
  console.log(
    "🍺 Brew: 予期せぬエラーが発生しました。サーバーを安全に停止します。"
  );
  console.error(error);
  process.exit(1);
});

// 未処理のPromise拒否
process.on("unhandledRejection", (reason, promise) => {
  console.log("🍺 Brew: Promise関連のエラーが発生しました。");
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startDevServer();
