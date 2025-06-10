interface ProgressIndicatorProps {
  progress: number;
  status: string;
  currentStep: string;
  totalSteps: number;
  isActive: boolean;
  error?: string;
}

export function ProgressIndicator({
  progress,
  status,
  currentStep,
  totalSteps,
  isActive,
  error
}: ProgressIndicatorProps) {
  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (progress === 100) return 'bg-green-500';
    if (isActive) return 'bg-td-primary';
    return 'bg-gray-300';
  };

  const getStatusIcon = () => {
    if (error) return '❌';
    if (progress === 100) return '✅';
    if (isActive) return '🔄';
    return '⏳';
  };

  const getTextColor = () => {
    if (error) return 'text-red-600';
    if (progress === 100) return 'text-green-600';
    return 'text-td-primary-700';
  };

  return (
    <div className="bg-white rounded-xl border border-td-primary-100 p-4 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className={`font-medium text-sm ${getTextColor()}`}>
            {status}
          </span>
        </div>
        <span className="text-xs text-td-primary-400">
          {progress}%
        </span>
      </div>

      {/* 進捗バー */}
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ease-out ${getStatusColor()}`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>

      {/* 詳細情報 */}
      {currentStep && (
        <div className="text-xs text-td-primary-500">
          <span className="font-medium">現在の処理:</span> {currentStep}
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="text-xs text-red-600 font-medium">エラーが発生しました</div>
          <div className="text-xs text-red-500 mt-1">{error}</div>
        </div>
      )}

      {/* 完了メッセージ */}
      {progress === 100 && !error && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="text-xs text-green-600 font-medium">
            🎉 処理が正常に完了しました！
          </div>
        </div>
      )}
    </div>
  );
} 