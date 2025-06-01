import { Capacitor } from '@capacitor/core';
import { deepfakeApi } from './deepfakeApi';

export interface CallInfo {
  phoneNumber: string;
  isIncoming: boolean;
  timestamp: number;
  isActive: boolean;
}

class CallMonitorService {
  private listeners: ((callInfo: CallInfo) => void)[] = [];
  private audioAnalysisListeners: ((result: any) => void)[] = [];
  private isInitialized = false;
  private isMonitoring = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingInterval: NodeJS.Timeout | null = null;
  private currentCallInfo: CallInfo | null = null;
  private stream: MediaStream | null = null;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      console.log('Initializing live call monitoring service');
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      this.isInitialized = true;
      console.log('Call monitoring service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize call monitoring service:', error);
      return false;
    }
  }
  
  /**
   * Start monitoring calls with continuous recording
   */
  async startMonitoring(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }
    
    if (this.isMonitoring) return true;
    
    try {
      // Get audio stream
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Start continuous recording
      this.startContinuousRecording();
      
      this.isMonitoring = true;
      console.log('Started live call monitoring');
      
      // Notify listeners that monitoring has started
      this.currentCallInfo = {
        phoneNumber: 'Live Call',
        isIncoming: true,
        timestamp: Date.now(),
        isActive: true
      };
      
      this.notifyCallEvent(this.currentCallInfo);
      
      return true;
    } catch (error) {
      console.error('Failed to start call monitoring:', error);
      return false;
    }
  }
  
  /**
   * Start continuous recording in 5-second chunks
   */
  private startContinuousRecording(): void {
    if (!this.stream) return;
    
    // Create MediaRecorder
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    // Handle data available
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };
    
    // Handle recording stop - send to API
    this.mediaRecorder.onstop = async () => {
      if (this.audioChunks.length > 0) {
        // Create blob from chunks
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Convert to WAV or MP3 format that your API expects
        const audioFile = new File([audioBlob], "chunk.webm", { type: "audio/webm" });
        
        // Send to deepfake API
        try {
          console.log('Sending audio chunk for analysis...');
          const result = await deepfakeApi.detectAudio(audioFile);
          
          // Notify listeners of analysis result
          this.notifyAnalysisResult(result);
        } catch (error) {
          console.error('Error analyzing audio chunk:', error);
        }
        
        // Clear chunks for next recording
        this.audioChunks = [];
      }
      
      // If still monitoring, start next recording
      if (this.isMonitoring && this.mediaRecorder) {
        this.mediaRecorder.start();
      }
    };
    
    // Start initial recording
    this.mediaRecorder.start();
    
    // Set up interval to stop and restart recording every 5 seconds
    this.recordingInterval = setInterval(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        console.log('Processing 5-second audio chunk...');
        this.mediaRecorder.stop();
      }
    }, 5000); // 5 seconds
  }
  
  /**
   * Stop monitoring calls
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) return;
    
    try {
      // Stop the recording interval
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
      
      // Stop media recorder
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
      
      // Stop all audio tracks
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      
      // Clear audio chunks
      this.audioChunks = [];
      
      // Update call info
      if (this.currentCallInfo) {
        this.currentCallInfo.isActive = false;
        this.notifyCallEvent(this.currentCallInfo);
      }
      
      this.isMonitoring = false;
      console.log('Stopped live call monitoring');
    } catch (error) {
      console.error('Failed to stop call monitoring:', error);
    }
  }
  
  /**
   * Register a listener for call events
   */
  addCallListener(listener: (callInfo: CallInfo) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Register a listener for audio analysis results
   */
  addAnalysisListener(listener: (result: any) => void): void {
    this.audioAnalysisListeners.push(listener);
  }
  
  /**
   * Remove a listener from call events
   */
  removeCallListener(listener: (callInfo: CallInfo) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Remove an analysis listener
   */
  removeAnalysisListener(listener: (result: any) => void): void {
    this.audioAnalysisListeners = this.audioAnalysisListeners.filter(l => l !== listener);
  }
  
  /**
   * Notify all listeners of a call event
   */
  private notifyCallEvent(callInfo: CallInfo): void {
    this.listeners.forEach(listener => listener(callInfo));
  }
  
  /**
   * Notify all listeners of analysis results
   */
  private notifyAnalysisResult(result: any): void {
    this.audioAnalysisListeners.forEach(listener => listener(result));
  }
  
  /**
   * Check if currently monitoring
   */
  isCurrentlyMonitoring(): boolean {
    return this.isMonitoring;
  }
  
  /**
   * Get current call info
   */
  getCurrentCall(): CallInfo | null {
    return this.currentCallInfo;
  }
}

export const callMonitorService = new CallMonitorService();