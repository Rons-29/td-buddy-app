#!/usr/bin/env node

/**
 * TestData Buddy 機能テストスクリプト
 * 新機能の動作確認用自動テスト
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const BASE_URL = 'http://localhost:3000';

// テスト結果保存用
const testResults = {
  csvGenerator: { status: 'pending', errors: [] },
  dateTimeGenerator: { status: 'pending', errors: [] },
  colorGenerator: { status: 'pending', errors: [] },
  navigation: { status: 'pending', errors: [] }
};

async function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] 🤖 TD テスト:`;
  
  switch (type) {
    case 'success':
      console.log(chalk.green(`${prefix} ✅ ${message}`));
      break;
    case 'error':
      console.log(chalk.red(`${prefix} ❌ ${message}`));
      break;
    case 'warning':
      console.log(chalk.yellow(`${prefix} ⚠️  ${message}`));
      break;
    default:
      console.log(chalk.blue(`${prefix} ${message}`));
  }
}

async function testCSVGenerator(page) {
  try {
    await log('CSV テストデータ生成機能をテスト中...');
    
    // CSV ページに移動
    await page.goto(`${BASE_URL}/csv-test`, { waitUntil: 'networkidle0' });
    
    // ページタイトル確認
    const title = await page.title();
    if (!title.includes('TestData Buddy')) {
      throw new Error('ページタイトルが正しくありません');
    }
    
    // ヘッダー要素確認
    const header = await page.waitForSelector('h1', { timeout: 5000 });
    const headerText = await header.textContent();
    if (!headerText.includes('CSV')) {
      throw new Error('CSVページのヘッダーが見つかりません');
    }
    
    // TDメッセージ確認
    const tdMessage = await page.waitForSelector('.bg-orange-50', { timeout: 5000 });
    if (!tdMessage) {
      throw new Error('TDキャラクターメッセージが表示されていません');
    }
    
    // 生成ボタンの存在確認
    const generateButton = await page.waitForSelector('button', { timeout: 5000 });
    if (!generateButton) {
      throw new Error('生成ボタンが見つかりません');
    }
    
    testResults.csvGenerator.status = 'success';
    await log('CSV 機能テスト完了', 'success');
    
  } catch (error) {
    testResults.csvGenerator.status = 'error';
    testResults.csvGenerator.errors.push(error.message);
    await log(`CSV 機能テストエラー: ${error.message}`, 'error');
  }
}

async function testDateTimeGenerator(page) {
  try {
    await log('日付・時刻データ生成機能をテスト中...');
    
    // DateTime ページに移動
    await page.goto(`${BASE_URL}/datetime`, { waitUntil: 'networkidle0' });
    
    // ヘッダー確認
    const header = await page.waitForSelector('h1', { timeout: 5000 });
    const headerText = await header.textContent();
    if (!headerText.includes('日付・時刻')) {
      throw new Error('DateTimeページのヘッダーが見つかりません');
    }
    
    // TDメッセージ確認
    const tdMessage = await page.waitForSelector('.bg-green-50', { timeout: 5000 });
    if (!tdMessage) {
      throw new Error('TDキャラクターメッセージが表示されていません');
    }
    
    // 設定フォーム確認
    const formatSelect = await page.waitForSelector('select', { timeout: 5000 });
    if (!formatSelect) {
      throw new Error('フォーマット選択要素が見つかりません');
    }
    
    // 生成ボタンクリックテスト
    const generateButton = await page.waitForSelector('button[variant="primary"]', { timeout: 5000 });
    if (generateButton) {
      await generateButton.click();
      // 結果が表示されるまで待機
      await page.waitForTimeout(1000);
    }
    
    testResults.dateTimeGenerator.status = 'success';
    await log('DateTime 機能テスト完了', 'success');
    
  } catch (error) {
    testResults.dateTimeGenerator.status = 'error';
    testResults.dateTimeGenerator.errors.push(error.message);
    await log(`DateTime 機能テストエラー: ${error.message}`, 'error');
  }
}

async function testColorGenerator(page) {
  try {
    await log('カラーデータ生成機能をテスト中...');
    
    // Color ページに移動
    await page.goto(`${BASE_URL}/colors`, { waitUntil: 'networkidle0' });
    
    // ヘッダー確認
    const header = await page.waitForSelector('h1', { timeout: 5000 });
    const headerText = await header.textContent();
    if (!headerText.includes('カラー')) {
      throw new Error('Colorページのヘッダーが見つかりません');
    }
    
    // TDメッセージ確認
    const tdMessage = await page.waitForSelector('.bg-pink-50', { timeout: 5000 });
    if (!tdMessage) {
      throw new Error('TDキャラクターメッセージが表示されていません');
    }
    
    // カラースキーム選択確認
    const colorSchemeSelect = await page.waitForSelector('select', { timeout: 5000 });
    if (!colorSchemeSelect) {
      throw new Error('カラースキーム選択要素が見つかりません');
    }
    
    testResults.colorGenerator.status = 'success';
    await log('Color 機能テスト完了', 'success');
    
  } catch (error) {
    testResults.colorGenerator.status = 'error';
    testResults.colorGenerator.errors.push(error.message);
    await log(`Color 機能テストエラー: ${error.message}`, 'error');
  }
}

async function testNavigation(page) {
  try {
    await log('ナビゲーション機能をテスト中...');
    
    // ホームページから各機能へのリンク確認
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    
    // 新機能のカード確認
    const csvCard = await page.waitForSelector('text=CSV テストデータ生成', { timeout: 5000 });
    const dateTimeCard = await page.waitForSelector('text=日付・時刻データ生成', { timeout: 5000 });
    const colorCard = await page.waitForSelector('text=カラーデータ生成', { timeout: 5000 });
    
    if (!csvCard || !dateTimeCard || !colorCard) {
      throw new Error('新機能のナビゲーションカードが見つかりません');
    }
    
    testResults.navigation.status = 'success';
    await log('ナビゲーション機能テスト完了', 'success');
    
  } catch (error) {
    testResults.navigation.status = 'error';
    testResults.navigation.errors.push(error.message);
    await log(`ナビゲーション機能テストエラー: ${error.message}`, 'error');
  }
}

async function generateTestReport() {
  await log('='.repeat(50));
  await log('🤖 TD 機能テスト結果レポート');
  await log('='.repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  
  for (const [feature, result] of Object.entries(testResults)) {
    totalTests++;
    
    if (result.status === 'success') {
      passedTests++;
      await log(`${feature}: PASS`, 'success');
    } else {
      await log(`${feature}: FAIL`, 'error');
      result.errors.forEach(error => {
        await log(`  - ${error}`, 'error');
      });
    }
  }
  
  await log('-'.repeat(50));
  await log(`総テスト数: ${totalTests}`);
  await log(`成功: ${passedTests}`, passedTests === totalTests ? 'success' : 'warning');
  await log(`失敗: ${totalTests - passedTests}`, totalTests - passedTests === 0 ? 'success' : 'error');
  await log(`成功率: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    await log('🎉 全ての機能テストが成功しました！', 'success');
  } else {
    await log('⚠️ 一部の機能テストが失敗しました。確認が必要です。', 'warning');
  }
}

async function runTests() {
  await log('🚀 TestData Buddy 機能テスト開始');
  
  const browser = await puppeteer.launch({ 
    headless: false, // デバッグ用に表示
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // テスト実行
    await testNavigation(page);
    await testCSVGenerator(page);
    await testDateTimeGenerator(page);
    await testColorGenerator(page);
    
    // レポート生成
    await generateTestReport();
    
  } catch (error) {
    await log(`テスト実行中にエラー: ${error.message}`, 'error');
  } finally {
    await browser.close();
  }
}

// テスト実行
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testResults }; 