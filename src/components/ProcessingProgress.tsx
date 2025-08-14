import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ProcessingProgress as ProcessingProgressType } from '@/types/log';

interface ProcessingProgressProps {
  progress: ProcessingProgressType;
}

export function ProcessingProgress({ progress }: ProcessingProgressProps) {
  const getStageIcon = () => {
    switch (progress.stage) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'uploading':
      case 'parsing':
      case 'extracting':
      case 'analyzing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const getStageColor = () => {
    switch (progress.stage) {
      case 'complete':
        return 'gradient-safe';
      case 'uploading':
      case 'parsing':
      case 'extracting':
      case 'analyzing':
        return 'gradient-primary';
      default:
        return 'gradient-threat';
    }
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {getStageIcon()}
          <div>
            <h3 className="font-semibold text-foreground capitalize">
              {progress.stage === 'complete' ? 'Analysis Complete' : `${progress.stage}...`}
            </h3>
            <p className="text-sm text-muted-foreground">{progress.message}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(progress.progress)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={progress.progress} 
              className="h-2"
            />
            <div 
              className={`absolute inset-0 h-2 rounded-full opacity-30 ${getStageColor()}`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
        
        {progress.stage !== 'complete' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Processing logs locally - no data leaves your browser
          </div>
        )}
      </div>
    </Card>
  );
}