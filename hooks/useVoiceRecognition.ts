import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null,
  });

  const startListening = useCallback(() => {
    if (Platform.OS === 'web') {
      // Web implementation using Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setState(prev => ({ ...prev, transcript, isListening: false }));
        };

        recognition.onerror = (event: any) => {
          setState(prev => ({ 
            ...prev, 
            error: 'Speech recognition error', 
            isListening: false 
          }));
        };

        recognition.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognition.start();
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Speech recognition not supported in this browser' 
        }));
      }
    } else {
      // For native platforms, use expo-speech for demo purposes
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null,
        transcript: 'Voice recognition demo - please type your command' 
      }));
      
      // Simulate voice recognition completion after 2 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, isListening: false }));
      }, 2000);
    }
  }, []);

  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
  };
}