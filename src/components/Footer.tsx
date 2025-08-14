import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Privacy Notice */}
          <Card className="p-6 border-accent/20 bg-accent/5">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  100% client-side analysis. Your data never leaves your browser.
                </p>
              </div>
            </div>
          </Card>

          {/* MITRE ATT&CK */}
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  MITRE ATT&CK
                  <Badge variant="outline" className="text-xs">
                    Framework
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Powered by MITRE ATT&CK knowledge base for threat mapping.
                </p>
                <a 
                  href="https://attack.mitre.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  Learn more about MITRE ATT&CK
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* Log Copilot Info */}
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Log Copilot</span>
                <Badge variant="secondary" className="text-xs">v1.0.0</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered SOC analyst dashboard for private log analysis.
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">TensorFlow.js</Badge>
                <Badge variant="outline" className="text-xs">TypeScript</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the cybersecurity community. 
            Open source and privacy-focused.
          </p>
        </div>
      </div>
    </footer>
  );
}