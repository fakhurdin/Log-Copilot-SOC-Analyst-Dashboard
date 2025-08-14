import { IOC } from '@/types/log';

// Regex patterns for IOC extraction
const IOC_PATTERNS = {
  ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  domain: /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g,
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
  hash_md5: /\b[a-fA-F0-9]{32}\b/g,
  hash_sha1: /\b[a-fA-F0-9]{40}\b/g,
  hash_sha256: /\b[a-fA-F0-9]{64}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
};

// Known suspicious/malicious indicators
const SUSPICIOUS_INDICATORS = {
  domains: [
    'malicious-domain.evil',
    'suspicious-c2.badactor',
    'cryptominer.pool',
    'phishing-site.scam',
    'data-exfil.attacker'
  ],
  ips: [
    '1.2.3.4',
    '5.6.7.8',
    '9.10.11.12',
    '13.14.15.16',
    '17.18.19.20'
  ],
  processes: [
    'malware.exe',
    'backdoor.exe',
    'trojan.exe',
    'keylogger.exe'
  ],
  commands: [
    'powershell.exe -EncodedCommand',
    'net user /add',
    'regsvr32.exe /s /u /i:http',
    'wmic process call create'
  ]
};

export function extractIOCs(text: string, context?: string): IOC[] {
  const iocs: IOC[] = [];

  // Extract IPs
  const ips = text.match(IOC_PATTERNS.ip) || [];
  ips.forEach(ip => {
    // Filter out private IPs for better signal
    if (!isPrivateIP(ip)) {
      const confidence = SUSPICIOUS_INDICATORS.ips.includes(ip) ? 0.9 : 0.6;
      iocs.push({
        type: 'ip',
        value: ip,
        confidence,
        context
      });
    }
  });

  // Extract domains
  const domains = text.match(IOC_PATTERNS.domain) || [];
  domains.forEach(domain => {
    // Filter out common legitimate domains
    if (!isCommonDomain(domain)) {
      const confidence = SUSPICIOUS_INDICATORS.domains.includes(domain) ? 0.95 : 0.7;
      iocs.push({
        type: 'domain',
        value: domain,
        confidence,
        context
      });
    }
  });

  // Extract URLs
  const urls = text.match(IOC_PATTERNS.url) || [];
  urls.forEach(url => {
    iocs.push({
      type: 'url',
      value: url,
      confidence: 0.8,
      context
    });
  });

  // Extract hashes
  const hashes = [
    ...(text.match(IOC_PATTERNS.hash_md5) || []).map(h => ({ hash: h, type: 'MD5' })),
    ...(text.match(IOC_PATTERNS.hash_sha1) || []).map(h => ({ hash: h, type: 'SHA1' })),
    ...(text.match(IOC_PATTERNS.hash_sha256) || []).map(h => ({ hash: h, type: 'SHA256' }))
  ];
  
  hashes.forEach(({ hash }) => {
    iocs.push({
      type: 'hash',
      value: hash,
      confidence: 0.9,
      context
    });
  });

  // Extract emails
  const emails = text.match(IOC_PATTERNS.email) || [];
  emails.forEach(email => {
    iocs.push({
      type: 'email',
      value: email,
      confidence: 0.7,
      context
    });
  });

  return iocs;
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;
  
  return false;
}

function isCommonDomain(domain: string): boolean {
  const commonDomains = [
    'google.com', 'microsoft.com', 'amazon.com', 'facebook.com', 'github.com',
    'apple.com', 'cloudflare.com', 'akamai.com', 'windows.com'
  ];
  
  return commonDomains.some(common => 
    domain.toLowerCase().includes(common) || common.includes(domain.toLowerCase())
  );
}

export function analyzeIOCPatterns(iocs: IOC[]): { 
  threatLevel: 'low' | 'medium' | 'high',
  summary: string 
} {
  const highConfidenceIOCs = iocs.filter(ioc => ioc.confidence > 0.8);
  const suspiciousCount = iocs.filter(ioc => 
    SUSPICIOUS_INDICATORS.domains.includes(ioc.value) || 
    SUSPICIOUS_INDICATORS.ips.includes(ioc.value)
  ).length;

  let threatLevel: 'low' | 'medium' | 'high' = 'low';
  let summary = '';

  if (suspiciousCount > 3 || highConfidenceIOCs.length > 5) {
    threatLevel = 'high';
    summary = `High threat detected: ${suspiciousCount} known malicious indicators found`;
  } else if (suspiciousCount > 1 || highConfidenceIOCs.length > 2) {
    threatLevel = 'medium';
    summary = `Medium threat detected: ${suspiciousCount} suspicious indicators found`;
  } else {
    summary = `Low threat: ${iocs.length} indicators extracted for analysis`;
  }

  return { threatLevel, summary };
}