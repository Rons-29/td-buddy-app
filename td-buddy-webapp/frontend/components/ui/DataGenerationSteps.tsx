interface DataGenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}

interface DataGenerationStepsProps {
  steps: DataGenerationStep[];
  currentStepId?: string;
}

export function DataGenerationSteps({ steps, currentStepId }: DataGenerationStepsProps) {
  const getStepIcon = (status: DataGenerationStep['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'active':
        return '🔄';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStepColor = (status: DataGenerationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'active':
        return 'text-td-primary-600 bg-td-primary-50 border-td-primary-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getConnectorColor = (status: DataGenerationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-300';
      case 'active':
        return 'bg-td-primary-300';
      case 'error':
        return 'bg-red-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-td-primary-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-td-primary-800 mb-3 flex items-center gap-2">
        🍺 <span>TDの作業進捗</span>
      </h3>
      
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* ステップ項目 */}
            <div className={`
              relative flex items-center gap-3 p-2 rounded-lg border transition-all duration-200
              ${getStepColor(step.status)}
              ${step.status === 'active' ? 'shadow-sm' : ''}
            `}>
              {/* アイコン */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className={`text-sm ${step.status === 'active' ? 'animate-spin' : ''}`}>
                  {getStepIcon(step.status)}
                </span>
              </div>
              
              {/* コンテンツ */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">
                  {step.title}
                </div>
                <div className="text-xs opacity-75 truncate">
                  {step.description}
                </div>
                {step.duration && (
                  <div className="text-xs opacity-60 mt-1">
                    処理時間: {step.duration}ms
                  </div>
                )}
              </div>
            </div>

            {/* 接続線（最後のステップ以外） */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-2 -mt-1">
                <div className={`w-full h-full ${getConnectorColor(step.status)}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 全体的な進捗表示 */}
      <div className="mt-3 pt-3 border-t border-td-primary-100">
        <div className="flex items-center justify-between text-xs text-td-primary-600">
          <span>全体進捗</span>
          <span>
            {steps.filter(s => s.status === 'completed').length} / {steps.length} 完了
          </span>
        </div>
      </div>
    </div>
  );
} 