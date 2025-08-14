import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Quote, Gift, Heart } from 'lucide-react';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export function WelcomeSplash({ onContinue }: WelcomeSplashProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const quotes = [
    {
      text: "The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room with armed guards.",
      author: "Gene Spafford"
    },
    {
      text: "Security is not a product, but a process.",
      author: "Bruce Schneier"
    },
    {
      text: "The best defense is a good offense.",
      author: "Sun Tzu"
    },
    {
      text: "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite.",
      author: "Marlon Brando"
    },
    {
      text: "The Internet is not just one thing, it's a collection of things – of numerous communications networks that all speak the same digital language.",
      author: "Tim Berners-Lee"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center z-50">
      <Card className="p-8 max-w-3xl mx-4 text-center border-0 bg-slate-800/90 backdrop-blur shadow-2xl">
        <div className="space-y-8">
          {/* Personal Message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Gift className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-semibold">FREE TOOL FOR SOC ANALYSTS</span>
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <h3 className="text-2xl font-bold">A Gift to the Cybersecurity Community</h3>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-slate-300">by</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FAKHAR
              </span>
            </div>
          </div>

          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Log Copilot
              </h1>
            </div>
            <h2 className="text-xl text-slate-300">
              SOC Analysis Dashboard
            </h2>
          </div>

          {/* Quote */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Quote className="w-6 h-6 text-blue-400" />
            </div>
            <blockquote className="text-lg text-slate-200 italic">
              "{quotes[currentQuote].text}"
            </blockquote>
            <p className="text-sm text-slate-400">
              — {quotes[currentQuote].author}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-slate-300">
              Welcome to Log Copilot, a privacy-first security log analysis tool. 
              All processing happens locally in your browser - no data ever leaves your device.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm text-slate-400">
              <span className="bg-blue-500/20 px-3 py-1 rounded-full">🔒 100% Client-Side</span>
              <span className="bg-purple-500/20 px-3 py-1 rounded-full">🤖 AI-Powered Analysis</span>
              <span className="bg-green-500/20 px-3 py-1 rounded-full">🎯 MITRE ATT&CK Mapping</span>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
