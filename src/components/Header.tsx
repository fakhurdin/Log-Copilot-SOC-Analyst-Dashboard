import { Shield, Activity, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Log Copilot</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">SOC Analyst Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Status */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <Activity className="w-4 h-4 text-accent" />
                <span>100% Client-Side</span>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Status */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <Activity className="w-4 h-4 text-accent" />
                <span>100% Client-Side Analysis</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}