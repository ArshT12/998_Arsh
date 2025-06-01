import axios from 'axios';

const API_URL = 'https://arshtandon-deepfake-detection-api-2.hf.space/detect';

export type DetectionResult = {
  isDeepfake: boolean;
  confidence: number;
  rawResponse: string;
};

export const deepfakeApi = {
  /**
   * @param audioFile - Audio file for analysis
   * @returns Detection result with confidence score
   */
  async detectAudio(audioFile: File | Blob, recordingContext?: any): Promise<DetectionResult> {
    console.log('🔍 Starting audio detection...');
    console.log('📱 Platform:', navigator.platform);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📂 File type:', audioFile.type);
    console.log('📏 File size:', audioFile.size);
    
    if (recordingContext) {
      console.log('🎙️ Recording Context:', {
        mimeType: recordingContext.mimeType,
        audioBitsPerSecond: recordingContext.audioBitsPerSecond,
        state: recordingContext.state,
        stream: recordingContext.stream ? {
          active: recordingContext.stream.active,
          id: recordingContext.stream.id
        } : 'No stream info'
      });
    }
    
    // Log detailed audio blob info
    console.log('Audio blob details:', {
      size: audioFile.size,
      type: audioFile.type,
      lastModified: audioFile instanceof File ? audioFile.lastModified : 'N/A',
      name: audioFile instanceof File ? audioFile.name : 'Generated blob'
    });
    
    try {
      const formData = new FormData();
      
      // Ensure proper file type and name
      const file = audioFile instanceof File 
        ? audioFile 
        : new File([audioFile], "recorded-audio.wav", { type: "audio/wav" });
      
      console.log('Final file type:', file.type);
      console.log('Final file name:', file.name);
      console.log('Final file size:', file.size);
      console.log('Sending to API:', API_URL);
      
      formData.append('audio', file);

      const startTime = performance.now();
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      const endTime = performance.now();
      const requestDuration = endTime - startTime;

      console.log('API Response Status:', response.status);
      console.log('API Response Time:', `${requestDuration.toFixed(2)}ms`);
      console.log('API Response Data:', response.data);
      
      const data = response.data;
      
      const result = {
        isDeepfake: data.isDeepfake,
        confidence: data.confidence,
        rawResponse: data.message,
      };
      
      console.log('✅ Final Result:', result);
      console.log('🔍 Confidence Score:', `${result.confidence.toFixed(2)}%`);
      console.log('🎯 Detection:', result.isDeepfake ? '🔴 DEEPFAKE' : '🟢 AUTHENTIC');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error detecting audio:', error);
      
      if (axios.isAxiosError(error)) {
        console.log('❌ Axios Error Details:');
        console.log('  - Status:', error.response?.status);
        console.log('  - Data:', error.response?.data);
        console.log('  - Headers:', error.response?.headers);
        console.log('  - Request made:', !!error.request);
        console.log('  - Response received:', !!error.response);
        console.log('  - Timeout:', error.code === 'ECONNABORTED');
        
        if (error.response?.status === 400) {
          throw new Error('Invalid audio file format. Please upload a WAV or MP3 file.');
        } else if (error.response?.status === 500) {
          throw new Error('Server error during audio analysis. Please try again.');
        } else if (error.response) {
          throw new Error(`API Error: ${error.response.data?.detail || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach the API. Check your internet connection.');
        }
      } else {
        console.log('❌ Non-Axios Error:', error);
      }
      
      throw new Error('An unexpected error occurred during audio analysis');
    }
  }
};