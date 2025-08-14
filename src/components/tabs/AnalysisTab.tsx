import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult } from '@/types/log';
import { 
  AlertTriangle, 
  Activity, 
  Clock, 
  Target,
  TrendingUp,
  Shield,
  Brain,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalysisTabProps {
  analysisResult: AnalysisResult | null;
}

export function AnalysisTab({ analysisResult }: AnalysisTabProps) {
  const anomalyData = useMemo(() => {
    if (!analysisResult) return [];
    
    // Group anomalies by hour for timeline
    const hourlyData: Record<number, number> = {};
    analysisResult.anomalies.forEach(anomaly => {
      const hour = anomaly.timestamp.getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      anomalies: hourlyData[i] || 0,
      displayHour: `${i.toString().padStart(2, '0')}:00`
    }));
  }, [analysisResult]);

  const eventTypeData = useMemo(() => {
    if (!analysisResult) return [];
    
    const eventTypes: Record<string, number> = {};
    // This would be populated from actual log analysis
    return [
      { name: 'Network', count: 45, color: '#4ECDC4' },
      { name: 'Process', count: 32, color: '#45B7D1' },
      { name: 'Authentication', count: 23, color: '#F9CA24' },
      { name: 'File System', count: 18, color: '#6C5CE7' },
      { name: 'Registry', count: 12, color: '#A29BFE' }
    ];
  }, [analysisResult]);

  const threatLevelData = useMemo(() => {
    if (!analysisResult) return [];
    
    const levels = ['Critical', 'High', 'Medium', 'Low'];
    const colors = ['#FF6B6B', '#FF9F43', '#F9CA24', '#6C5CE7'];
    
    return levels.map((level, index) => ({
      name: level,
      value: Math.floor(Math.random() * 10) + 1,
      color: colors[index]
    }));
  }, [analysisResult]);

  if (!analysisResult) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-muted/30 mb-4">
            <Brain className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Analysis Available
          </h3>
          <p className="text-muted-foreground">
            Upload log files to begin automated analysis and anomaly detection.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold text-foreground">
                {analysisResult.totalLogs.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anomalies</p>
              <p className="text-2xl font-bold text-foreground">
                {analysisResult.anomalies.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ioc/10">
              <Search className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">IOCs Found</p>
              <p className="text-2xl font-bold text-foreground">
                {analysisResult.iocs.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MITRE Techniques</p>
              <p className="text-2xl font-bold text-foreground">
                {Object.keys(analysisResult.mitreMapping).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Analysis Summary</h3>
        </div>
        <div className="prose prose-sm text-muted-foreground max-w-none">
          <p>{analysisResult.summary}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            Analysis period: {analysisResult.timeRange.start.toLocaleDateString()} - {analysisResult.timeRange.end.toLocaleDateString()}
          </span>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Timeline */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Anomaly Timeline
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="displayHour" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="anomalies" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--warning))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Event Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Event Types
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Threat Level Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-destructive" />
          Threat Level Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatLevelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {threatLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {threatLevelData.map((level, index) => (
              <div key={level.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{level.name}</span>
                </div>
                <Badge variant="outline">{level.value}</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}