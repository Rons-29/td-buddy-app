import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomCharsetsEditor } from '../../components/CustomCharsetsEditor';
import { PasswordGenerator } from '../../components/PasswordGenerator';

// Mock fetch for API calls
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Password Generation Frontend Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('PasswordGenerator Component', () => {
    it('🧪 基本的なパスワード生成フローが動作する', async () => {
      const user = userEvent.setup();

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            passwords: ['TestPass123!', 'SecurePass456@', 'StrongPass789#'],
            stats: { generated: 3, strength: 'strong' },
          },
        }),
      } as Response);

      render(<PasswordGenerator />);

      // 長さ設定
      const lengthSlider = screen.getByRole('slider');
      fireEvent.change(lengthSlider, { target: { value: '16' } });

      // 生成個数設定
      const countInput = screen.getByDisplayValue('1');
      await user.clear(countInput);
      await user.type(countInput, '3');

      // 文字種選択
      const uppercaseCheckbox = screen.getByLabelText(/大文字/);
      const lowercaseCheckbox = screen.getByLabelText(/小文字/);
      const numbersCheckbox = screen.getByLabelText(/数字/);
      const symbolsCheckbox = screen.getByLabelText(/記号/);

      await user.click(uppercaseCheckbox);
      await user.click(lowercaseCheckbox);
      await user.click(numbersCheckbox);
      await user.click(symbolsCheckbox);

      // 生成ボタンクリック
      const generateButton = screen.getByText(/パスワードを生成/);
      await user.click(generateButton);

      // API呼び出し確認
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/password/generate',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('"length":16'),
          })
        );
      });

      // 結果表示確認
      await waitFor(() => {
        expect(screen.getByText('TestPass123!')).toBeInTheDocument();
        expect(screen.getByText('SecurePass456@')).toBeInTheDocument();
        expect(screen.getByText('StrongPass789#')).toBeInTheDocument();
      });
    });

    it('🧪 構成プリセット選択が正しく動作する', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            passwords: ['Hg8@pL2#vK9!'],
            stats: { generated: 1, strength: 'very-strong' },
          },
        }),
      } as Response);

      render(<PasswordGenerator />);

      // 構成プリセット選択
      const presetSelect = screen.getByDisplayValue('none');
      await user.selectOptions(presetSelect, 'high-security');

      // 生成ボタンクリック
      const generateButton = screen.getByText(/パスワードを生成/);
      await user.click(generateButton);

      // 構成プリセットAPIが呼ばれることを確認
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/password/generate-with-composition',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"composition":"high-security"'),
          })
        );
      });
    });

    it('🧪 除外設定が反映される', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            passwords: ['Kg8pL2vK9'],
            stats: { generated: 1, strength: 'strong' },
          },
        }),
      } as Response);

      render(<PasswordGenerator />);

      // 除外設定を有効化
      const excludeAmbiguousCheckbox =
        screen.getByLabelText(/紛らわしい文字を除外/);
      const excludeSimilarCheckbox =
        screen.getByLabelText(/似ている記号を除外/);

      await user.click(excludeAmbiguousCheckbox);
      await user.click(excludeSimilarCheckbox);

      // 生成ボタンクリック
      const generateButton = screen.getByText(/パスワードを生成/);
      await user.click(generateButton);

      // 除外設定がリクエストに含まれることを確認
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('"excludeAmbiguous":true'),
          })
        );
      });
    });

    it('🧪 エラーハンドリングが正しく動作する', async () => {
      const user = userEvent.setup();

      // API エラーをモック
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'パスワード長が無効です',
          },
        }),
      } as Response);

      render(<PasswordGenerator />);

      const generateButton = screen.getByText(/パスワードを生成/);
      await user.click(generateButton);

      // エラーメッセージ表示確認
      await waitFor(() => {
        expect(screen.getByText(/パスワード長が無効です/)).toBeInTheDocument();
      });
    });

    it('🧪 大量生成時の進行状況表示', async () => {
      const user = userEvent.setup();

      // 遅延を含むAPIレスポンス
      mockFetch.mockImplementationOnce(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    data: {
                      passwords: Array(500)
                        .fill(null)
                        .map((_, i) => `Password${i}`),
                      stats: { generated: 500, strength: 'strong' },
                    },
                  }),
                } as Response),
              2000
            )
          )
      );

      render(<PasswordGenerator />);

      // 大量生成設定
      const countInput = screen.getByDisplayValue('1');
      await user.clear(countInput);
      await user.type(countInput, '500');

      const generateButton = screen.getByText(/パスワードを生成/);
      await user.click(generateButton);

      // ローディング表示確認
      expect(screen.getByText(/生成中/)).toBeInTheDocument();

      // 完了後の表示確認
      await waitFor(
        () => {
          expect(screen.queryByText(/生成中/)).not.toBeInTheDocument();
          expect(screen.getByText(/500件のパスワード/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('CustomCharsetsEditor Component', () => {
    it('🧪 ドラッグアンドドロップが正しく動作する', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(
        <CustomCharsetsEditor
          charsets={[
            {
              id: '1',
              name: '数字',
              charset: '0123456789',
              min: 1,
              enabled: true,
              color: '#ef4444',
            },
            {
              id: '2',
              name: '大文字',
              charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              min: 1,
              enabled: true,
              color: '#3b82f6',
            },
          ]}
          onChange={mockOnChange}
          visible={true}
        />
      );

      // ドラッグ可能な要素が存在することを確認
      expect(screen.getByText('数字')).toBeInTheDocument();
      expect(screen.getByText('大文字')).toBeInTheDocument();

      // ドラッグハンドルの存在確認
      const dragHandles = screen.getAllByRole('button', {
        name: /ドラッグハンドル/,
      });
      expect(dragHandles).toHaveLength(2);
    });

    it('🧪 文字セット編集が動作する', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(
        <CustomCharsetsEditor
          charsets={[
            {
              id: '1',
              name: '数字',
              charset: '0123456789',
              min: 1,
              enabled: true,
              color: '#ef4444',
            },
          ]}
          onChange={mockOnChange}
          visible={true}
        />
      );

      // 編集ボタンクリック
      const editButton = screen.getByRole('button', { name: /編集/ });
      await user.click(editButton);

      // 文字セット入力フィールドが表示される
      const charsInput = screen.getByDisplayValue('0123456789');
      expect(charsInput).toBeInTheDocument();

      // 文字セット変更
      await user.clear(charsInput);
      await user.type(charsInput, '123456789');

      // 保存ボタンクリック
      const saveButton = screen.getByRole('button', { name: /保存/ });
      await user.click(saveButton);

      // onChange が呼ばれることを確認
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('🧪 プリセット文字セット追加が動作する', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(
        <CustomCharsetsEditor
          charsets={[]}
          onChange={mockOnChange}
          visible={true}
        />
      );

      // プリセット追加ボタンクリック
      const addPresetButton = screen.getByText(/プリセット追加/);
      await user.click(addPresetButton);

      // プリセット選択
      const hiraganaOption = screen.getByText('ひらがな');
      await user.click(hiraganaOption);

      // onChange が呼ばれることを確認
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'ひらがな',
            charset: expect.stringContaining('あいうえお'),
          }),
        ])
      );
    });

    it('🧪 文字セットバリデーションが動作する', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(
        <CustomCharsetsEditor
          charsets={[
            {
              id: '1',
              name: '数字',
              charset: '0123456789',
              min: 1,
              enabled: true,
              color: '#ef4444',
            },
          ]}
          onChange={mockOnChange}
          visible={true}
        />
      );

      // 編集モードに入る
      const editButton = screen.getByRole('button', { name: /編集/ });
      await user.click(editButton);

      // 空の文字セットを入力
      const charsInput = screen.getByDisplayValue('0123456789');
      await user.clear(charsInput);

      // 保存を試行
      const saveButton = screen.getByRole('button', { name: /保存/ });
      await user.click(saveButton);

      // エラーメッセージ表示確認
      expect(screen.getByText(/文字セットが空です/)).toBeInTheDocument();
    });
  });

  describe('Performance and User Experience', () => {
    it('🧪 レスポンシブデザインが正しく動作する', () => {
      // モバイルサイズでのレンダリング
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PasswordGenerator />);

      // モバイル用のレイアウト要素が存在することを確認
      expect(screen.getByRole('main')).toHaveClass('container');
    });

    it('🧪 キーボードナビゲーションが動作する', async () => {
      const user = userEvent.setup();

      render(<PasswordGenerator />);

      // Tabキーでフォーカス移動
      await user.tab();
      expect(screen.getByRole('slider')).toHaveFocus();

      await user.tab();
      expect(screen.getByDisplayValue('1')).toHaveFocus();

      // Enterキーで生成
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { passwords: ['TestPassword'], stats: { generated: 1 } },
        }),
      } as Response);

      const generateButton = screen.getByText(/パスワードを生成/);
      generateButton.focus();
      await user.keyboard('{Enter}');

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
