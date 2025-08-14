import { LogEntry, MitreTechnique } from '@/types/log';

let mitreData: any = null;

// Fallback MITRE data in case the JSON file fails to load
const FALLBACK_MITRE_DATA = {
  techniques: {
    "T1566": {
      "name": "Phishing",
      "tactic": "Initial Access",
      "keywords": ["phishing", "malicious email", "suspicious attachment", "email threat"],
      "description": "Adversaries may send phishing messages to gain access to victim systems."
    },
    "T1059": {
      "name": "Command and Scripting Interpreter",
      "tactic": "Execution",
      "keywords": ["powershell", "cmd.exe", "bash", "script execution", "command line"],
      "description": "Adversaries may abuse command and script interpreters to execute commands."
    },
    "T1055": {
      "name": "Process Injection",
      "tactic": "Defense Evasion",
      "keywords": ["process injection", "dll injection", "reflective dll", "process hollowing"],
      "description": "Adversaries may inject code into processes to evade detection."
    },
    "T1003": {
      "name": "OS Credential Dumping",
      "tactic": "Credential Access",
      "keywords": ["credential dumping", "lsass", "sam database", "password hash"],
      "description": "Adversaries may attempt to dump credentials to obtain account login information."
    },
    "T1071": {
      "name": "Application Layer Protocol",
      "tactic": "Command and Control",
      "keywords": ["http", "https", "dns", "web traffic", "c2 communication"],
      "description": "Adversaries may communicate using application layer protocols."
    },
    "T1070": {
      "name": "Indicator Removal on Host",
      "tactic": "Defense Evasion",
      "keywords": ["log clearing", "event log deletion", "file deletion", "artifact removal"],
      "description": "Adversaries may delete or alter generated artifacts on a host system."
    }
  },
  tactics: {
    "Initial Access": {
      "description": "Techniques used to gain an initial foothold within a network",
      "color": "#ff6b6b"
    },
    "Execution": {
      "description": "Techniques that result in adversary-controlled code running on a local or remote system",
      "color": "#4ecdc4"
    },
    "Defense Evasion": {
      "description": "Techniques adversaries use to avoid detection throughout their compromise",
      "color": "#45b7d1"
    },
    "Credential Access": {
      "description": "Techniques for stealing credentials like account names and passwords",
      "color": "#f9ca24"
    },
    "Command and Control": {
      "description": "Techniques that adversaries may use to communicate with systems under their control",
      "color": "#a29bfe"
    }
  }
};

export async function loadMitreData(): Promise<any> {
  if (mitreData) return mitreData;
  
  try {
    const response = await fetch('/mappings/mitre-attack.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    mitreData = await response.json();
    return mitreData;
  } catch (error) {
    console.warn('Failed to load MITRE ATT&CK data from file, using fallback data:', error);
    mitreData = FALLBACK_MITRE_DATA;
    return mitreData;
  }
}

export function mapLogToMitre(logEntry: LogEntry): string[] {
  if (!mitreData) return [];

  const techniques: string[] = [];
  const logText = JSON.stringify(logEntry.raw_data).toLowerCase();
  const commandLine = logEntry.command?.toLowerCase() || '';
  const process = logEntry.process?.toLowerCase() || '';
  const domain = logEntry.domain?.toLowerCase() || '';

  // Check each MITRE technique for keyword matches
  for (const [techniqueId, technique] of Object.entries(mitreData.techniques)) {
    const techniqueData = technique as any;
    const keywords = techniqueData.keywords || [];

    // Check if any keywords match the log content
    const hasMatch = keywords.some((keyword: string) => {
      const keywordLower = keyword.toLowerCase();
      return logText.includes(keywordLower) || 
             commandLine.includes(keywordLower) || 
             process.includes(keywordLower) ||
             domain.includes(keywordLower);
    });

    if (hasMatch) {
      techniques.push(techniqueId);
    }
  }

  // Additional specific detection logic
  techniques.push(...detectSpecificTechniques(logEntry));

  return [...new Set(techniques)]; // Remove duplicates
}

function detectSpecificTechniques(logEntry: LogEntry): string[] {
  const techniques: string[] = [];
  const command = logEntry.command?.toLowerCase() || '';
  const process = logEntry.process?.toLowerCase() || '';

  // T1059 - Command and Scripting Interpreter
  if (command.includes('powershell') || command.includes('cmd.exe') || command.includes('bash')) {
    techniques.push('T1059');
  }

  // T1566 - Phishing (based on suspicious domains)
  if (logEntry.domain && isSuspiciousDomain(logEntry.domain)) {
    techniques.push('T1566');
  }

  // T1055 - Process Injection
  if (command.includes('reflective dll') || command.includes('process injection')) {
    techniques.push('T1055');
  }

  // T1003 - OS Credential Dumping
  if (command.includes('lsass') || command.includes('sam database') || process.includes('lsass.exe')) {
    techniques.push('T1003');
  }

  // T1070 - Indicator Removal on Host
  if (command.includes('wevtutil') || command.includes('log clearing')) {
    techniques.push('T1070');
  }

  // T1071 - Application Layer Protocol
  if (logEntry.dst_ip && (logEntry.domain || command.includes('http'))) {
    techniques.push('T1071');
  }

  return techniques;
}

function isSuspiciousDomain(domain: string): boolean {
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
  const suspiciousKeywords = ['evil', 'malicious', 'badactor', 'scam', 'phishing', 'c2', 'exfil'];
  
  const domainLower = domain.toLowerCase();
  
  return suspiciousTlds.some(tld => domainLower.endsWith(tld)) ||
         suspiciousKeywords.some(keyword => domainLower.includes(keyword));
}

export function generateMitreReport(logEntries: LogEntry[]): Record<string, number> {
  const techniqueCount: Record<string, number> = {};

  logEntries.forEach(entry => {
    entry.mitre_techniques.forEach(technique => {
      techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
    });
  });

  return techniqueCount;
}

export function getMitreTechniqueInfo(techniqueId: string): MitreTechnique | null {
  if (!mitreData || !mitreData.techniques[techniqueId]) return null;

  const technique = mitreData.techniques[techniqueId];
  return {
    id: techniqueId,
    name: technique.name,
    tactic: technique.tactic,
    keywords: technique.keywords,
    description: technique.description
  };
}

export function getMitreCoverage(logEntries: LogEntry[]): {
  totalTechniques: number;
  detectedTechniques: number;
  coveragePercentage: number;
  tacticCoverage: Record<string, number>;
} {
  if (!mitreData) {
    return { totalTechniques: 0, detectedTechniques: 0, coveragePercentage: 0, tacticCoverage: {} };
  }

  const allTechniques = Object.keys(mitreData.techniques);
  const detectedTechniques = new Set<string>();
  const tacticCoverage: Record<string, number> = {};

  logEntries.forEach(entry => {
    entry.mitre_techniques.forEach(technique => {
      detectedTechniques.add(technique);
      const techniqueInfo = mitreData.techniques[technique];
      if (techniqueInfo) {
        const tactic = techniqueInfo.tactic;
        tacticCoverage[tactic] = (tacticCoverage[tactic] || 0) + 1;
      }
    });
  });

  return {
    totalTechniques: allTechniques.length,
    detectedTechniques: detectedTechniques.size,
    coveragePercentage: (detectedTechniques.size / allTechniques.length) * 100,
    tacticCoverage
  };
}