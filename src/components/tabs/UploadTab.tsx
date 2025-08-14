import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessingProgress as ProcessingProgressType } from '@/types/log';
import { Upload, Database, Shield } from 'lucide-react';

interface UploadTabProps {
  onFilesUploaded: (files: File[]) => void;
  processingProgress?: ProcessingProgressType;
  isProcessing: boolean;
}

export function UploadTab({ onFilesUploaded, processingProgress, isProcessing }: UploadTabProps) {
  const [totalFiles, setTotalFiles] = useState(0);

  const handleFileUpload = (files: File[]) => {
    setTotalFiles(prev => prev + files.length);
    onFilesUploaded(files);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-8 gradient-cyber text-center animate-scale-in">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-white/10 backdrop-blur transition-smooth hover:scale-110 hover:bg-white/20">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Upload Your Security Logs
          </h2>
          <p className="text-white/90 text-base md:text-lg">
            Drag and drop your log files for instant, private analysis. 
            All processing happens locally in your browser.
          </p>
        </div>
      </Card>

      {/* Upload Component */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <FileUpload 
          onFileUpload={handleFileUpload}
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Processing Progress */}
      {isProcessing && processingProgress && (
        <div className="max-w-2xl mx-auto">
          <ProcessingProgress progress={processingProgress} />
        </div>
      )}

      {/* Supported Formats */}
      <Card className="p-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-accent" />
          Supported Log Formats
        </h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50 hover:scale-105">
              <Badge variant="secondary">Zeek</Badge>
              <span className="text-sm text-foreground">Network monitoring logs (DNS, HTTP, etc.)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50 hover:scale-105">
              <Badge variant="secondary">Sysmon</Badge>
              <span className="text-sm text-foreground">Windows system monitoring events</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50 hover:scale-105">
              <Badge variant="secondary">Windows Events</Badge>
              <span className="text-sm text-foreground">Standard Windows event logs</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50 hover:scale-105">
              <Badge variant="secondary">CloudTrail</Badge>
              <span className="text-sm text-foreground">AWS API and service logs</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-6 max-w-4xl mx-auto border-accent/20 bg-accent/5 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent mt-0.5 transition-smooth hover:scale-110" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Privacy First</h4>
            <p className="text-sm text-muted-foreground">
              Your logs never leave your browser. All analysis, IOC extraction, 
              anomaly detection, and MITRE mapping happen completely client-side. 
              No data is transmitted to any server.
            </p>
          </div>
        </div>
      </Card>

      {totalFiles > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {totalFiles} file{totalFiles !== 1 ? 's' : ''} processed
        </div>
      )}
    </div>
  );
}