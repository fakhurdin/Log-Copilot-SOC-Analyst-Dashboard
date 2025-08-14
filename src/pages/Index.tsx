import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { ContactTab } from '@/components/ContactTab';
import { WelcomeSplash } from '@/components/WelcomeSplash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadTab } from '@/components/tabs/UploadTab';
import { AnalysisTab } from '@/components/tabs/AnalysisTab';
import { IOCTab } from '@/components/tabs/IOCTab';
import { MitreTab } from '@/components/tabs/MitreTab';
import { ExportTab } from '@/components/tabs/ExportTab';
import { LogProcessor } from '@/utils/logProcessor';
import { AnalysisResult, ProcessingProgress } from '@/types/log';
import { Upload, Activity, Search, Target, Download, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { toast } = useToast();

  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true);
    const processor = new LogProcessor(setProcessingProgress);
    
    try {
      const result = await processor.processFiles(files);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Processed ${result.totalLogs} logs and found ${result.anomalies.length} anomalies.`,
      });
    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSplash) {
    return <WelcomeSplash onContinue={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[700px] mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="iocs" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">IOCs</span>
            </TabsTrigger>
            <TabsTrigger value="mitre" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">MITRE</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-fade-in">
            <UploadTab 
              onFilesUploaded={handleFilesUploaded}
              processingProgress={processingProgress}
              isProcessing={isProcessing}
            />
          </TabsContent>

          <TabsContent value="analysis" className="animate-fade-in">
            <AnalysisTab analysisResult={analysisResult} />
          </TabsContent>

          <TabsContent value="iocs" className="animate-fade-in">
            <IOCTab iocs={analysisResult?.iocs || []} />
          </TabsContent>

          <TabsContent value="mitre" className="animate-fade-in">
            <MitreTab mitreMapping={analysisResult?.mitreMapping || {}} />
          </TabsContent>

          <TabsContent value="about" className="animate-fade-in">
            <AboutSection />
          </TabsContent>

          <TabsContent value="contact" className="animate-fade-in">
            <ContactTab />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
