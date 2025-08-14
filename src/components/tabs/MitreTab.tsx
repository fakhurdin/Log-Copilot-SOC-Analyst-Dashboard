import { useMemo, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { loadMitreData, getMitreTechniqueInfo } from '@/utils/mitreMapper';
import { 
  Target, 
  Shield, 
  TrendingUp, 
  Book,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface MitreTabProps {
  mitreMapping: Record<string, number>;
}

export function MitreTab({ mitreMapping }: MitreTabProps) {
  const [mitreData, setMitreData] = useState<any>(null);

  useEffect(() => {
    loadMitreData().then(data => setMitreData(data));
  }, []);

  const mitreStats = useMemo(() => {
    if (!mitreData) return null;

    const totalTechniques = Object.keys(mitreData.techniques).length;
    const detectedTechniques = Object.keys(mitreMapping).length;
    const coveragePercentage = (detectedTechniques / totalTechniques) * 100;

    const tacticCoverage: Record<string, number> = {};
    Object.keys(mitreMapping).forEach(techniqueId => {
      const technique = mitreData.techniques[techniqueId];
      if (technique) {
        const tactic = technique.tactic;
        tacticCoverage[tactic] = (tacticCoverage[tactic] || 0) + mitreMapping[techniqueId];
      }
    });

    return {
      totalTechniques,
      detectedTechniques,
      coveragePercentage,
      tacticCoverage,
      totalDetections: Object.values(mitreMapping).reduce((a, b) => a + b, 0)
    };
  }, [mitreMapping, mitreData]);

  const sortedTechniques = useMemo(() => {
    return Object.entries(mitreMapping)
      .sort(([, a], [, b]) => b - a)
      .map(([techniqueId, count]) => ({
        id: techniqueId,
        count,
        info: getMitreTechniqueInfo(techniqueId)
      }));
  }, [mitreMapping]);

  const tacticStats = useMemo(() => {
    if (!mitreData || !mitreStats) return [];

    return Object.entries(mitreStats.tacticCoverage)
      .map(([tactic, count]) => ({
        name: tactic,
        count,
        color: mitreData.tactics[tactic]?.color || '#6B7280',
        description: mitreData.tactics[tactic]?.description || ''
      }))
      .sort((a, b) => b.count - a.count);
  }, [mitreData, mitreStats]);

  if (!mitreData || Object.keys(mitreMapping).length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-muted/30 mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No MITRE ATT&CK Mappings
          </h3>
          <p className="text-muted-foreground">
            Upload and analyze logs to map activities to MITRE ATT&CK techniques.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Techniques</p>
              <p className="text-2xl font-bold text-foreground">{mitreStats?.detectedTechniques}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Detections</p>
              <p className="text-2xl font-bold text-foreground">{mitreStats?.totalDetections}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coverage</p>
              <p className="text-2xl font-bold text-foreground">
                {mitreStats?.coveragePercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ioc/10">
              <Book className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tactics</p>
              <p className="text-2xl font-bold text-foreground">{tacticStats.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Coverage Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">MITRE ATT&CK Coverage</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {mitreStats?.detectedTechniques} of {mitreStats?.totalTechniques} techniques detected
            </span>
            <span className="text-foreground font-medium">
              {mitreStats?.coveragePercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={mitreStats?.coveragePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Coverage shows how many MITRE ATT&CK techniques were detected in your logs
          </p>
        </div>
      </Card>

      {/* Tactic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Tactics Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tacticStats.map((tactic) => (
            <div
              key={tactic.name}
              className="p-4 rounded-lg border border-border hover:bg-muted/20 transition-smooth"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: tactic.color }}
                  />
                  <span className="font-medium text-foreground">{tactic.name}</span>
                </div>
                <Badge variant="outline">{tactic.count}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {tactic.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Technique Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" />
          Detected Techniques
        </h3>
        <div className="space-y-4">
          {sortedTechniques.map(({ id, count, info }) => (
            <div
              key={id}
              className="p-4 rounded-lg border border-border hover:bg-muted/20 transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {id}
                    </Badge>
                    <span className="font-medium text-foreground">
                      {info?.name || 'Unknown Technique'}
                    </span>
                    {count > 5 && (
                      <Badge className="bg-threat-high/10 text-threat-high border-threat-high/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Activity
                      </Badge>
                    )}
                  </div>
                  
                  {info?.tactic && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {info.tactic}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {info?.description || 'No description available'}
                  </p>
                  
                  {info?.keywords && info.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {info.keywords.slice(0, 5).map((keyword: string) => (
                        <span 
                          key={keyword}
                          className="px-2 py-1 text-xs rounded bg-muted/50 text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground">detections</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={`https://attack.mitre.org/techniques/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}