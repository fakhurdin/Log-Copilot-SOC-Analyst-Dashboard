import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  acceptedTypes?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  acceptedTypes = {
    'text/csv': ['.csv'],
    'application/json': ['.json'],
    'text/tab-separated-values': ['.tsv'],
    'text/plain': ['.txt', '.log']
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  multiple = true,
  className
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Card 
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed border-border bg-muted/20 p-8 cursor-pointer transition-smooth',
          'hover:border-accent hover:bg-muted/30',
          isDragActive && 'border-accent bg-accent/10 glow-primary',
          isDragReject && 'border-destructive bg-destructive/10'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={cn(
            'w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center',
            isDragActive && 'border-accent text-accent animate-pulse-glow'
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-accent">Drop the files here...</p>
              <p className="text-sm text-muted-foreground">We'll analyze them instantly</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-foreground">
                Drag & drop your security logs here
              </p>
              <p className="text-sm text-muted-foreground">
                or <Button variant="link" className="p-0 h-auto text-accent">browse files</Button>
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {Object.values(acceptedTypes).flat().map(ext => (
                  <span 
                    key={ext} 
                    className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground border"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="p-4 bg-card/50">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent" />
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}