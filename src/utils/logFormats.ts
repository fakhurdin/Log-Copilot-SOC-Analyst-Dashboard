import { LogFormat } from '@/types/log';

export const LOG_FORMATS: LogFormat[] = [
  {
    name: 'Zeek DNS Logs',
    pattern: /timestamp.*uid.*query/i,
    fieldMapping: {
      'timestamp': 'timestamp',
      'id.orig_h': 'src_ip',
      'id.resp_h': 'dst_ip',
      'query': 'domain',
      'proto': 'protocol'
    },
    detector: (headers: string[]) => {
      const zeekHeaders = ['timestamp', 'uid', 'id.orig_h', 'query'];
      return zeekHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );
    }
  },
  {
    name: 'Sysmon Logs',
    pattern: /TimeGenerated.*EventID.*Image/i,
    fieldMapping: {
      'TimeGenerated': 'timestamp',
      'Image': 'process',
      'CommandLine': 'command',
      'User': 'username',
      'Computer': 'hostname'
    },
    detector: (headers: string[]) => {
      const sysmonHeaders = ['TimeGenerated', 'EventID', 'Image'];
      return sysmonHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );
    }
  },
  {
    name: 'Windows Event Logs',
    pattern: /TimeGenerated.*EventID.*Computer/i,
    fieldMapping: {
      'TimeGenerated': 'timestamp',
      'EventID': 'event_type',
      'Computer': 'hostname',
      'Message': 'message'
    },
    detector: (headers: string[]) => {
      const windowsHeaders = ['TimeGenerated', 'EventID', 'Computer'];
      return windowsHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );
    }
  },
  {
    name: 'AWS CloudTrail',
    pattern: /eventTime.*eventName.*sourceIPAddress/i,
    fieldMapping: {
      'eventTime': 'timestamp',
      'eventName': 'event_type',
      'sourceIPAddress': 'src_ip',
      'userName': 'username',
      'userIdentity.type': 'user_type'
    },
    detector: (headers: string[]) => {
      const cloudtrailHeaders = ['eventTime', 'eventName', 'sourceIPAddress'];
      return cloudtrailHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );
    }
  }
];

export function detectLogFormat(headers: string[]): LogFormat | null {
  for (const format of LOG_FORMATS) {
    if (format.detector(headers)) {
      return format;
    }
  }
  return null;
}

export function normalizeLogEntry(rawData: Record<string, any>, format: LogFormat): any {
  const normalized: any = {
    raw_data: rawData,
    mitre_techniques: [],
    iocs: []
  };

  // Map fields according to format
  for (const [sourceField, targetField] of Object.entries(format.fieldMapping)) {
    if (rawData[sourceField] !== undefined) {
      if (targetField === 'timestamp') {
        normalized[targetField] = new Date(rawData[sourceField]);
      } else {
        normalized[targetField] = rawData[sourceField];
      }
    }
  }

  // Set event type based on format
  if (!normalized.event_type) {
    normalized.event_type = format.name;
  }

  return normalized;
}