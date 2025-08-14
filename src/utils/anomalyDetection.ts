import { LogEntry } from '@/types/log';

export interface AnomalyScore {
  logId: string;
  score: number;
  factors: string[];
  isAnomaly: boolean;
}

// Simple anomaly detection using statistical methods
export function detectAnomalies(logEntries: LogEntry[], threshold: number = 0.7): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  // Calculate baseline statistics
  const stats = calculateBaselineStats(logEntries);

  logEntries.forEach(entry => {
    const score = calculateAnomalyScore(entry, stats);
    scores.push({
      logId: entry.id,
      score: score.score,
      factors: score.factors,
      isAnomaly: score.score > threshold
    });
  });

  return scores;
}

interface BaselineStats {
  commonPorts: Set<number>;
  commonProcesses: Set<string>;
  commonUsers: Set<string>;
  commonDomains: Set<string>;
  timeDistribution: Map<number, number>; // hour -> count
  avgCommandLength: number;
  ipFrequency: Map<string, number>;
}

function calculateBaselineStats(logEntries: LogEntry[]): BaselineStats {
  const stats: BaselineStats = {
    commonPorts: new Set(),
    commonProcesses: new Set(),
    commonUsers: new Set(),
    commonDomains: new Set(),
    timeDistribution: new Map(),
    avgCommandLength: 0,
    ipFrequency: new Map()
  };

  const commandLengths: number[] = [];

  logEntries.forEach(entry => {
    // Collect common processes
    if (entry.process) {
      const process = entry.process.toLowerCase();
      stats.commonProcesses.add(process);
    }

    // Collect common users
    if (entry.username) {
      stats.commonUsers.add(entry.username.toLowerCase());
    }

    // Collect common domains
    if (entry.domain) {
      stats.commonDomains.add(entry.domain.toLowerCase());
    }

    // Time distribution
    const hour = entry.timestamp.getHours();
    stats.timeDistribution.set(hour, (stats.timeDistribution.get(hour) || 0) + 1);

    // Command lengths
    if (entry.command) {
      commandLengths.push(entry.command.length);
    }

    // IP frequency
    if (entry.src_ip) {
      stats.ipFrequency.set(entry.src_ip, (stats.ipFrequency.get(entry.src_ip) || 0) + 1);
    }
  });

  stats.avgCommandLength = commandLengths.length > 0 
    ? commandLengths.reduce((a, b) => a + b, 0) / commandLengths.length 
    : 0;

  return stats;
}

function calculateAnomalyScore(entry: LogEntry, stats: BaselineStats): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Time-based anomaly (3am-6am is suspicious for business hours)
  const hour = entry.timestamp.getHours();
  if (hour >= 3 && hour <= 6) {
    score += 0.3;
    factors.push('Unusual time of activity');
  }

  // Rare process anomaly
  if (entry.process && !isCommonProcess(entry.process, stats.commonProcesses)) {
    score += 0.4;
    factors.push('Uncommon process execution');
  }

  // Suspicious command patterns
  if (entry.command) {
    const suspiciousPatterns = [
      /powershell.*-encodedcommand/i,
      /net\s+user.*\/add/i,
      /regsvr32.*\/s.*\/u.*http/i,
      /wmic.*process.*call.*create/i,
      /whoami/i,
      /net\s+localgroup/i
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(entry.command!)) {
        score += 0.5;
        factors.push('Suspicious command pattern detected');
      }
    });

    // Very long commands
    if (entry.command.length > stats.avgCommandLength * 3) {
      score += 0.3;
      factors.push('Unusually long command');
    }
  }

  // Domain-based anomalies
  if (entry.domain) {
    const domain = entry.domain.toLowerCase();
    
    // Suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.evil', '.badactor'];
    if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
      score += 0.6;
      factors.push('Suspicious domain TLD');
    }

    // Domain generation algorithm (DGA) characteristics
    if (isDGALike(domain)) {
      score += 0.5;
      factors.push('Possible DGA domain');
    }

    // Known malicious keywords
    const maliciousKeywords = ['malicious', 'evil', 'badactor', 'c2', 'exfil', 'phishing'];
    if (maliciousKeywords.some(keyword => domain.includes(keyword))) {
      score += 0.8;
      factors.push('Known malicious domain pattern');
    }
  }

  // IP-based anomalies
  if (entry.src_ip) {
    const frequency = stats.ipFrequency.get(entry.src_ip) || 0;
    const totalLogs = Array.from(stats.ipFrequency.values()).reduce((a, b) => a + b, 0);
    const rarity = 1 - (frequency / totalLogs);
    
    if (rarity > 0.95) { // Very rare IP
      score += 0.4;
      factors.push('Rare source IP');
    }
  }

  // Event frequency anomaly
  const eventCounts = calculateEventFrequency(entry.timestamp);
  if (eventCounts.eventsInHour > 100) { // High frequency of events
    score += 0.3;
    factors.push('High event frequency');
  }

  // Cap the score at 1.0
  return { score: Math.min(score, 1.0), factors };
}

function isCommonProcess(process: string, commonProcesses: Set<string>): boolean {
  const processLower = process.toLowerCase();
  const commonWindowsProcesses = [
    'explorer.exe', 'svchost.exe', 'wininit.exe', 'winlogon.exe',
    'services.exe', 'lsass.exe', 'csrss.exe', 'smss.exe'
  ];
  
  return commonProcesses.has(processLower) || 
         commonWindowsProcesses.some(common => processLower.includes(common));
}

function isDGALike(domain: string): boolean {
  // Simple DGA detection heuristics
  const domainPart = domain.split('.')[0];
  
  // Very long subdomain
  if (domainPart.length > 20) return true;
  
  // High consonant ratio
  const consonants = domainPart.replace(/[aeiou]/g, '').length;
  const vowels = domainPart.replace(/[^aeiou]/g, '').length;
  if (consonants > vowels * 2) return true;
  
  // Random-like character distribution
  const uniqueChars = new Set(domainPart).size;
  if (uniqueChars > domainPart.length * 0.7) return true;
  
  return false;
}

function calculateEventFrequency(timestamp: Date): { eventsInHour: number; eventsInMinute: number } {
  // In a real implementation, this would check against a sliding window
  // For demo purposes, return mock values
  return {
    eventsInHour: Math.floor(Math.random() * 150),
    eventsInMinute: Math.floor(Math.random() * 10)
  };
}

export function categorizeAnomalies(anomalies: AnomalyScore[]): {
  critical: AnomalyScore[];
  high: AnomalyScore[];
  medium: AnomalyScore[];
  low: AnomalyScore[];
} {
  return {
    critical: anomalies.filter(a => a.score >= 0.9),
    high: anomalies.filter(a => a.score >= 0.7 && a.score < 0.9),
    medium: anomalies.filter(a => a.score >= 0.5 && a.score < 0.7),
    low: anomalies.filter(a => a.score >= 0.3 && a.score < 0.5)
  };
}