import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Github, Linkedin, MessageSquare, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactTab() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for your feedback. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleDirectContact = (type: 'email' | 'github' | 'linkedin') => {
    const urls = {
      email: 'mailto:fakhurdin987@gmail.com?subject=Log Copilot - Feature Request/Collaboration',
      github: 'https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard/issues/new',
      linkedin: 'https://www.linkedin.com/in/fakhur-ul-din-b8902421b'
    };
    window.open(urls[type], '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <Card className="p-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a feature request? Want to collaborate? Found a bug? 
          I'd love to hear from you! Your feedback helps make Log Copilot better.
        </p>
      </Card>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover-lift">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Send me a direct email for quick responses
          </p>
          <Button 
            variant="outline" 
            onClick={() => handleDirectContact('email')}
            className="w-full"
          >
            Send Email
          </Button>
        </Card>

        <Card className="p-6 text-center hover-lift">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Github className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">GitHub Issues</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Report bugs or request features on GitHub
          </p>
          <Button 
            variant="outline" 
            onClick={() => handleDirectContact('github')}
            className="w-full"
          >
            Open Issue
          </Button>
        </Card>

        <Card className="p-6 text-center hover-lift">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Linkedin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">LinkedIn</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect professionally for collaboration
          </p>
          <Button 
            variant="outline" 
            onClick={() => handleDirectContact('linkedin')}
            className="w-full"
          >
            Connect
          </Button>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Send a Message</h3>
            <p className="text-muted-foreground">
              Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Subject
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Feature request, bug report, collaboration, etc."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your request, suggestion, or collaboration idea..."
                rows={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>

      {/* Common Requests */}
      <Card className="p-8">
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">Common Requests</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Feature Requests</h4>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">New log format support</Badge>
              <Badge variant="outline" className="mr-2">Enhanced AI models</Badge>
              <Badge variant="outline" className="mr-2">Additional export formats</Badge>
              <Badge variant="outline" className="mr-2">Real-time analysis</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Collaboration</h4>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">Code contributions</Badge>
              <Badge variant="outline" className="mr-2">Documentation help</Badge>
              <Badge variant="outline" className="mr-2">Testing assistance</Badge>
              <Badge variant="outline" className="mr-2">Security research</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
