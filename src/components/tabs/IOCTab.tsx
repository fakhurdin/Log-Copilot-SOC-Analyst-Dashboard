import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IOC } from '@/types/log';
import { 
  Copy, 
  Search, 
  Filter,
  Globe,
  Hash,
  Mail,
  Link,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface IOCTabProps {
  iocs: IOC[];
}

export function IOCTab({ iocs }: IOCTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredIOCs = useMemo(() => {
    return iocs.filter(ioc => {
      const matchesSearch = ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (ioc.context?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = selectedType === 'all' || ioc.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [iocs, searchTerm, selectedType]);

  const iocStats = useMemo(() => {
    const stats = {
      total: iocs.length,
      byType: {} as Record<string, number>,
      byConfidence: {
        high: iocs.filter(ioc => ioc.confidence > 0.8).length,
        medium: iocs.filter(ioc => ioc.confidence >= 0.5 && ioc.confidence <= 0.8).length,
        low: iocs.filter(ioc => ioc.confidence < 0.5).length
      }
    };

    iocs.forEach(ioc => {
      stats.byType[ioc.type] = (stats.byType[ioc.type] || 0) + 1;
    });

    return stats;
  }, [iocs]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: `IOC "${value}" copied successfully`,
    });
  };

  const copyAllIOCs = () => {
    const allIOCs = filteredIOCs.map(ioc => `${ioc.type.toUpperCase()}: ${ioc.value}`).join('\n');
    navigator.clipboard.writeText(allIOCs);
    toast({
      title: "All IOCs copied",
      description: `${filteredIOCs.length} IOCs copied to clipboard`,
    });
  };

  const getIOCIcon = (type: string) => {
    switch (type) {
      case 'ip':
        return <MapPin className="w-4 h-4" />;
      case 'domain':
        return <Globe className="w-4 h-4" />;
      case 'url':
        return <Link className="w-4 h-4" />;
      case 'hash':
        return <Hash className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 0.8) {
      return <Badge className="bg-threat-high/10 text-threat-high border-threat-high/20">High</Badge>;
    } else if (confidence >= 0.5) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
    } else {
      return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Low</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ip: 'text-blue-400',
      domain: 'text-green-400',
      url: 'text-purple-400',
      hash: 'text-orange-400',
      email: 'text-pink-400'
    };
    return colors[type as keyof typeof colors] || 'text-muted-foreground';
  };

  if (iocs.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-muted/30 mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No IOCs Detected
          </h3>
          <p className="text-muted-foreground">
            Upload and analyze logs to extract Indicators of Compromise.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total IOCs</p>
              <p className="text-2xl font-bold text-foreground">{iocStats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-threat-high/10">
              <AlertTriangle className="w-5 h-5 text-threat-high" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Confidence</p>
              <p className="text-2xl font-bold text-foreground">{iocStats.byConfidence.high}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <CheckCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medium Confidence</p>
              <p className="text-2xl font-bold text-foreground">{iocStats.byConfidence.medium}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/10">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Types Found</p>
              <p className="text-2xl font-bold text-foreground">{Object.keys(iocStats.byType).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search IOCs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'ip', 'domain', 'url', 'hash', 'email'].map(type => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type === 'all' ? 'All' : type}
                {type !== 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {iocStats.byType[type] || 0}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <Button onClick={copyAllIOCs} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
        </div>
      </Card>

      {/* IOC List */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredIOCs.map((ioc, index) => (
            <div
              key={`${ioc.type}-${ioc.value}-${index}`}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-smooth"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-lg bg-muted/20 ${getTypeColor(ioc.type)}`}>
                  {getIOCIcon(ioc.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge variant="outline" className="uppercase text-xs">
                      {ioc.type}
                    </Badge>
                    {getConfidenceBadge(ioc.confidence)}
                  </div>
                  <p className="font-mono text-sm text-foreground break-all">
                    {ioc.value}
                  </p>
                  {ioc.context && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Context: {ioc.context}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right text-sm">
                  <div className="text-foreground font-medium">
                    {Math.round(ioc.confidence * 100)}%
                  </div>
                  <div className="text-muted-foreground text-xs">
                    confidence
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(ioc.value)}
                  className="ml-3"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredIOCs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No IOCs match your search criteria.
              </p>
            </div>
          )}
        </div>
      </Card>

      {filteredIOCs.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredIOCs.length} of {iocs.length} IOCs
        </div>
      )}
    </div>
  );
}