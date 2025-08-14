export interface LogEntry {
  id: string;
  timestamp: Date;
  event_type: string;
  src_ip?: string;
  dst_ip?: string;
  username?: string;
  command?: string;
  process?: string;
  domain?: string;
  raw_data: Record<string, any>;
  anomaly_score?: number;
  mitre_techniques: string[];
  iocs: IOC[];
}

export interface IOC {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  confidence: number;
  context?: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  keywords: string[];
  description: string;
}

export interface LogFormat {
  name: string;
  pattern: RegExp;
  fieldMapping: Record<string, string>;
  detector: (headers: string[]) => boolean;
}

export interface AnalysisResult {
  totalLogs: number;
  anomalies: LogEntry[];
  iocs: IOC[];
  mitreMapping: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
  summary: string;
}

export interface ProcessingProgress {
  stage: 'uploading' | 'parsing' | 'extracting' | 'analyzing' | 'complete';
  progress: number;
  message: string;
}