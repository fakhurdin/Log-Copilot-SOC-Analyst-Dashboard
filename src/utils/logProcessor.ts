import Papa from 'papaparse';
import { LogEntry, LogFormat, IOC, ProcessingProgress, AnalysisResult } from '@/types/log';
import { detectLogFormat, normalizeLogEntry } from './logFormats';
import { extractIOCs, analyzeIOCPatterns } from './iocExtractor';
import { mapLogToMitre, generateMitreReport, loadMitreData } from './mitreMapper';
import { detectAnomalies } from './anomalyDetection';

export class LogProcessor {
  private onProgress?: (progress: ProcessingProgress) => void;

  constructor(onProgress?: (progress: ProcessingProgress) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(stage: ProcessingProgress['stage'], progress: number, message: string) {
    if (this.onProgress) {
      this.onProgress({ stage, progress, message });
    }
  }

  async processFiles(files: File[]): Promise<AnalysisResult> {
    this.updateProgress('uploading', 0, 'Starting file processing...');

    try {
      // Load MITRE data first
      await loadMitreData();
    } catch (error) {
      console.warn('MITRE data loading failed, continuing without it:', error);
    }

    let allLogs: LogEntry[] = [];
    let totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileProgress = (i / totalFiles) * 30; // First 30% for file processing
      
      this.updateProgress('parsing', fileProgress, `Processing ${file.name}...`);
      
      try {
        const logs = await this.processFile(file);
        allLogs.push(...logs);
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        // Continue with other files instead of failing completely
        continue;
      }
    }

    if (allLogs.length === 0) {
      throw new Error('No valid log entries found in the uploaded files. Please check your file format.');
    }

    this.updateProgress('extracting', 40, 'Extracting IOCs and mapping MITRE techniques...');

    // Extract IOCs and map MITRE techniques
    const processedLogs = this.enrichLogs(allLogs);

    this.updateProgress('analyzing', 70, 'Running anomaly detection...');

    // Run anomaly detection
    const anomalyScores = detectAnomalies(processedLogs);
    const anomalies = processedLogs.filter((log, index) => {
      const score = anomalyScores[index];
      if (score && score.isAnomaly) {
        log.anomaly_score = score.score;
        return true;
      }
      return false;
    });

    this.updateProgress('analyzing', 90, 'Generating analysis report...');

    // Collect all IOCs
    const allIOCs: IOC[] = [];
    processedLogs.forEach(log => allIOCs.push(...log.iocs));

    // Generate MITRE mapping
    const mitreMapping = generateMitreReport(processedLogs);

    // Generate summary
    const { threatLevel, summary } = analyzeIOCPatterns(allIOCs);
    const fullSummary = this.generateSummary(processedLogs.length, anomalies.length, allIOCs.length, Object.keys(mitreMapping).length, threatLevel);

    this.updateProgress('complete', 100, 'Analysis complete!');

    return {
      totalLogs: processedLogs.length,
      anomalies,
      iocs: allIOCs,
      mitreMapping,
      timeRange: this.getTimeRange(processedLogs),
      summary: fullSummary
    };
  }

  private async processFile(file: File): Promise<LogEntry[]> {
    return new Promise((resolve, reject) => {
      const isJSON = file.type === 'application/json' || file.name.endsWith('.json');
      
      if (isJSON) {
        // Handle JSON files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const jsonData = JSON.parse(content);
            const logs = Array.isArray(jsonData) ? jsonData : [jsonData];
            const processedLogs = logs.map((log, index) => this.createLogEntry(log, 'JSON', index));
            resolve(processedLogs);
          } catch (error) {
            reject(new Error(`Failed to parse JSON file: ${error}`));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read JSON file'));
        reader.readAsText(file);
      } else {
        // Handle CSV/TSV files
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing errors:', results.errors);
            }

            if (!results.data || results.data.length === 0) {
              reject(new Error('No data found in CSV file'));
              return;
            }

            const format = detectLogFormat(results.meta.fields || []);
            if (!format) {
              console.warn('Unknown log format, using generic processing');
            }

            const logs = results.data.map((row, index) => {
              const normalized = format ? normalizeLogEntry(row as any, format) : row;
              return this.createLogEntry(normalized, format?.name || 'Unknown', index);
            });

            resolve(logs);
          },
          error: (error) => {
            reject(new Error(`Failed to parse CSV file: ${error.message}`));
          }
        });
      }
    });
  }

  private createLogEntry(data: any, format: string, index: number): LogEntry {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    
    return {
      id: `${format}-${index}-${timestamp.getTime()}`,
      timestamp,
      event_type: data.event_type || data.EventID || format,
      src_ip: data.src_ip || data['id.orig_h'] || data.sourceIPAddress,
      dst_ip: data.dst_ip || data['id.resp_h'],
      username: data.username || data.User || data.userName,
      command: data.command || data.CommandLine,
      process: data.process || data.Image,
      domain: data.domain || data.query,
      raw_data: data,
      mitre_techniques: [],
      iocs: []
    };
  }

  private enrichLogs(logs: LogEntry[]): LogEntry[] {
    return logs.map(log => {
      // Extract IOCs from the log entry
      const logText = JSON.stringify(log.raw_data);
      const iocs = extractIOCs(logText, `${log.event_type} - ${log.timestamp.toISOString()}`);
      
      // Map to MITRE techniques
      const techniques = mapLogToMitre(log);
      
      return {
        ...log,
        iocs,
        mitre_techniques: techniques
      };
    });
  }

  private getTimeRange(logs: LogEntry[]): { start: Date; end: Date } {
    if (logs.length === 0) {
      const now = new Date();
      return { start: now, end: now };
    }

    const timestamps = logs.map(log => log.timestamp.getTime());
    return {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps))
    };
  }

  private generateSummary(totalLogs: number, anomalies: number, iocs: number, mitreCount: number, threatLevel: string): string {
    const anomalyRate = ((anomalies / totalLogs) * 100).toFixed(1);
    
    let summary = `Analyzed ${totalLogs.toLocaleString()} log entries and detected ${anomalies} anomalies (${anomalyRate}% anomaly rate). `;
    
    if (iocs > 0) {
      summary += `Extracted ${iocs} Indicators of Compromise with ${threatLevel} threat level. `;
    }
    
    if (mitreCount > 0) {
      summary += `Mapped activities to ${mitreCount} MITRE ATT&CK techniques, indicating potential adversary tactics. `;
    }
    
    if (anomalies > 0 || iocs > 0) {
      summary += `Immediate investigation recommended for high-confidence detections.`;
    } else {
      summary += `No significant threats detected in the analyzed timeframe.`;
    }
    
    return summary;
  }
}