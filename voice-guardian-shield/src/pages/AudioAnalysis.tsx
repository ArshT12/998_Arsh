import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioRecorder from '../components/AudioRecorder';
import FileAnalyzer from '../components/FileAnalyzer';
import DetectionStatus from '../components/DetectionStatus';
import { deepfakeApi } from '../services/deepfakeApi';
import { callMonitorService } from '../services/callMonitorService';
import { backgroundService } from '../services/backgroundService';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Phone, Mic, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AudioAnalysis: React.FC = () => {
  const { addDetection, settings } = useApp();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<null | { isDeepfake: boolean; confidence: number }>(null);
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);

  // Initialize call monitor
  useEffect(() => {
    const initCallMonitor = async () => {
      await callMonitorService.initialize();
      
      // Add listener for call events
      callMonitorService.addCallListener((callInfo) => {
        if (callInfo.isActive) {
          toast.info("Live call monitoring started", {
            description: "Analyzing voice every 5 seconds"
          });
        } else {
          toast.info("Live call monitoring stopped");
        }
      });
      
      // Add listener for analysis results
      callMonitorService.addAnalysisListener((result) => {
        handleLiveAnalysisResult(result);
      });
    };
    
    initCallMonitor();
    
    return () => {
      if (isLiveCallActive) {
        callMonitorService.stopMonitoring();
      }
    };
  }, []);
  
  // Handle live call toggle
  const toggleLiveCall = async () => {
    if (!isLiveCallActive) {
      // Start monitoring
      const started = await callMonitorService.startMonitoring();
      if (started) {
        setIsLiveCallActive(true);
        setAnalysisCount(0);
        setDetectionResult(null);
        
        // Start background service if available
        backgroundService.startBackgroundMonitoring();
      } else {
        toast.error("Failed to start live call monitoring", {
          description: "Please check microphone permissions"
        });
      }
    } else {
      // Stop monitoring
      await callMonitorService.stopMonitoring();
      setIsLiveCallActive(false);
      backgroundService.stopBackgroundMonitoring();
    }
  };
  
  // Handle analysis results from live call
  const handleLiveAnalysisResult = (result: any) => {
    setAnalysisCount(prev => prev + 1);
    setLastAnalysisTime(new Date());
    
    setDetectionResult({
      isDeepfake: result.isDeepfake,
      confidence: result.confidence
    });
    
    // Add to detection history
    addDetection({
      isDeepfake: result.isDeepfake,
      confidence: result.confidence,
      phoneNumber: 'Live Call Monitoring'
    });
    
    // Handle deepfake detection
    if (result.isDeepfake && result.confidence >= settings.deepfakeThreshold) {
      toast.error("⚠️ Deepfake Detected!", {
        description: `Confidence: ${result.confidence.toFixed(0)}%`,
        duration: 5000
      });
      
      // Vibrate if enabled
      if (settings.vibrateOnDeepfake && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // Auto-end call if enabled
      if (settings.autoEndCallOnDeepfake) {
        toast.error("Auto-ending call due to deepfake detection", {
          description: "Based on your settings"
        });
        toggleLiveCall();
      }
    }
  };

  const analyzeAudio = async (audioData: File | Blob) => {
    setIsAnalyzing(true);
    
    try {
      const audioFile = audioData instanceof File 
        ? audioData 
        : new File([audioData], "recorded-audio.wav", { type: "audio/wav" });
      
      const result = await deepfakeApi.detectAudio(audioFile);
      
      setDetectionResult({
        isDeepfake: result.isDeepfake,
        confidence: result.confidence
      });
      
      addDetection({
        isDeepfake: result.isDeepfake,
        confidence: result.confidence,
        phoneNumber: 'Manual Analysis'
      });
      
      if (result.isDeepfake) {
        toast.error("Deepfake Detected!", {
          description: `Confidence: ${result.confidence.toFixed(0)}%`
        });
      } else {
        toast.success("Voice Authentic", {
          description: `Confidence: ${result.confidence.toFixed(0)}%`
        });
      }
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      toast.error('Error analyzing audio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    analyzeAudio(audioBlob);
  };

  const handleFileSelected = (file: File) => {
    analyzeAudio(file);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Voice Guardian Shield" />
      
      <div className="flex-grow px-4 py-6 pb-24">
        <Tabs defaultValue="live" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="live">Live Call</TabsTrigger>
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live">
            <div className="guardian-card p-6">
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold mb-2">Live Call Monitoring</h2>
                  <p className="text-sm text-guardian-gray">
                    Continuously analyze voice during calls
                  </p>
                </div>
                
                {isLiveCallActive && (
                  <div className="mb-6 w-full">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="text-blue-600 mr-2" size={20} />
                        <span className="font-medium text-blue-800">Monitoring Active</span>
                      </div>
                      <div className="text-sm text-blue-700">
                        <p>Chunks analyzed: {analysisCount}</p>
                        {lastAnalysisTime && (
                          <p>Last analysis: {lastAnalysisTime.toLocaleTimeString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {detectionResult && isLiveCallActive && (
                  <div className="mb-6">
                    <DetectionStatus 
                      isDetecting={false} 
                      isDeepfake={detectionResult.isDeepfake}
                      confidence={detectionResult.confidence}
                    />
                  </div>
                )}
                
                <Button
                  onClick={toggleLiveCall}
                  size="lg"
                  variant={isLiveCallActive ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  <Phone size={20} />
                  {isLiveCallActive ? "Stop Monitoring" : "Start Live Call Monitoring"}
                </Button>
                
                {!isLiveCallActive && (
                  <p className="text-xs text-guardian-gray mt-4 text-center">
                    This will continuously record and analyze audio in 5-second chunks
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="record">
            <div className="guardian-card p-6">
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
              
              {!isAnalyzing && detectionResult && activeTab === 'record' && (
                <div className="mt-6">
                  <DetectionStatus 
                    isDetecting={false} 
                    isDeepfake={detectionResult.isDeepfake}
                    confidence={detectionResult.confidence}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="guardian-card p-6">
              <FileAnalyzer onFileSelected={handleFileSelected} />
              
              {!isAnalyzing && detectionResult && activeTab === 'upload' && (
                <div className="mt-6">
                  <DetectionStatus 
                    isDetecting={false} 
                    isDeepfake={detectionResult.isDeepfake}
                    confidence={detectionResult.confidence}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {isAnalyzing && (
          <div className="guardian-card p-4 mt-6">
            <h2 className="text-lg font-bold mb-4 text-center">Analyzing Audio</h2>
            <DetectionStatus 
              isDetecting={true} 
              isDeepfake={null}
              confidence={0}
            />
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default AudioAnalysis;