import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Mail, Shield, Code, Brain, Award, Quote } from 'lucide-react';

export function AboutSection() {
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
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* About the Author */}
      <Card className="p-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-primary/20 flex items-center justify-center overflow-hidden">
              <img
                src="/my.jpg"
                alt="Fakhur Ul Din"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Shield className="w-12 h-12 text-primary hidden" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Fakhur Ul Din</h2>
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Student of Cybersecurity & SOC Analysis
            </Badge>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate cybersecurity student with a focus on threat detection, incident response, and security automation. 
            Dedicated to building innovative security tools that enhance organizational security posture and empower SOC teams.
            Currently learning and exploring the vast world of cybersecurity.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline">
              <Brain className="w-4 h-4 mr-2" />
              AI Security
            </Badge>
            <Badge variant="outline">
              <Code className="w-4 h-4 mr-2" />
              Threat Detection
            </Badge>
            <Badge variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              SOC Analysis
            </Badge>
            <Badge variant="outline">
              <Award className="w-4 h-4 mr-2" />
              Incident Response
            </Badge>
          </div>
        </div>
      </Card>

      {/* Security Quotes */}
      <Card className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">Security Wisdom</h3>
          <p className="text-muted-foreground">Inspirational quotes from cybersecurity leaders</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {quotes.map((quote, index) => (
            <div key={index} className="p-6 border border-border rounded-lg">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <blockquote className="text-foreground italic mb-3">
                    "{quote.text}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — {quote.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Section */}
      <Card className="p-8 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Connect with me for collaboration opportunities, cybersecurity discussions, or to learn more about this project
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <a 
              href="mailto:fakhurdin987@gmail.com"
              className="flex items-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </Button>
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
          >
            <a 
              href="https://github.com/fakhurdin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </Button>
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900"
          >
            <a 
              href="https://www.linkedin.com/in/fakhur-ul-din-b8902421b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
          </Button>
        </div>
      </Card>

      {/* Project Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 text-center">
          <h4 className="font-semibold text-foreground mb-2">Open Source</h4>
          <p className="text-sm text-muted-foreground">
            This project is completely open source and free to use. Contribute, fork, or modify as needed.
          </p>
        </Card>

        <Card className="p-6 text-center">
          <h4 className="font-semibold text-foreground mb-2">Privacy First</h4>
          <p className="text-sm text-muted-foreground">
            All analysis happens locally in your browser. No data leaves your device.
          </p>
        </Card>
      </div>

      {/* Mission Statement */}
      <Card className="p-8 text-center">
        <h3 className="text-xl font-bold text-foreground mb-4">Our Mission</h3>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          To democratize cybersecurity analysis by providing powerful, privacy-focused tools that enable 
          security professionals to detect threats faster and more effectively, without compromising data security.
        </p>
      </Card>
    </div>
  );
}