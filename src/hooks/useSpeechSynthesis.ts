import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceOption } from '../types';

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Add custom Bengali voice
  const customVoices = [
    {
      name: "Bengali Voice (Custom)",
      lang: "bn-BD",
      customVoice: true
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Function to load and set voices
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        
        const voiceOptions: VoiceOption[] = availableVoices.map((voice, index) => {
          // Extract accent/region from name if possible
          const nameParts = voice.name.split(' ');
          const accent = nameParts.length > 1 ? nameParts[nameParts.length - 1].replace(/[()]/g, '') : undefined;
          
          return {
            name: voice.name,
            lang: voice.lang,
            value: index.toString(),
            accent,
            default: voice.default
          };
        });
        
        // Add custom voices
        customVoices.forEach((customVoice, index) => {
          voiceOptions.push({
            name: customVoice.name,
            lang: customVoice.lang,
            value: `custom-${index}`,
            accent: "Custom",
            customVoice: true
          });
        });
        
        // Sort voices by language and name
        voiceOptions.sort((a, b) => {
          if (a.lang !== b.lang) {
            return a.lang.localeCompare(b.lang);
          }
          return a.name.localeCompare(b.name);
        });
        
        setVoices(voiceOptions);
      };

      // Load voices immediately (for Chrome)
      loadVoices();
      
      // Also set up the event for when voices change (for Firefox)
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, voiceIndex: string, rate: number, pitch: number, volume: number) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set properties
    if (voiceIndex.startsWith('custom-')) {
      // Handle custom voice (like Bengali)
      const customIndex = parseInt(voiceIndex.split('-')[1], 10);
      const customVoice = customVoices[customIndex];
      
      if (customVoice) {
        utterance.lang = customVoice.lang;
        // For Bengali, we'll use the default voice but set the language to Bengali
      }
    } else {
      // Set standard voice
      const availableVoices = synthRef.current.getVoices();
      const voiceIndexNum = parseInt(voiceIndex, 10);
      if (availableVoices[voiceIndexNum]) {
        utterance.voice = availableVoices[voiceIndexNum];
      }
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Set event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    
    // Start speaking
    synthRef.current.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && speaking && !paused) {
      synthRef.current.pause();
      setPaused(true);
    }
  }, [speaking, paused]);

  const resume = useCallback(() => {
    if (synthRef.current && speaking && paused) {
      synthRef.current.resume();
      setPaused(false);
    }
  }, [speaking, paused]);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  }, []);

  // Function to convert text to audio blob
  const convertToAudio = useCallback(async (
    text: string, 
    voiceIndex: string, 
    rate: number, 
    pitch: number, 
    volume: number,
    format: string = 'mp3'
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      
      // Set MIME type based on format
      const mimeType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'audio/webm'
      });
      
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };

      // Start recording
      mediaRecorder.start();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voiceIndex.startsWith('custom-')) {
        // Handle custom voice (like Bengali)
        const customIndex = parseInt(voiceIndex.split('-')[1], 10);
        const customVoice = customVoices[customIndex];
        
        if (customVoice) {
          utterance.lang = customVoice.lang;
        }
      } else {
        // Set standard voice
        const availableVoices = window.speechSynthesis.getVoices();
        const voiceIndexNum = parseInt(voiceIndex, 10);
        if (availableVoices[voiceIndexNum]) {
          utterance.voice = availableVoices[voiceIndexNum];
        }
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onend = () => {
        mediaRecorder.stop();
        audioContext.close();
      };

      utterance.onerror = (event) => {
        mediaRecorder.stop();
        audioContext.close();
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Use a fallback method since direct audio capture isn't possible
      // This is a workaround - in a real app, you'd use a server-side TTS service
      window.speechSynthesis.speak(utterance);
      
      // Simulate recording for a few seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          audioContext.close();
        }
      }, Math.max(2000, text.length * 100)); // Ensure minimum recording time
    });
  }, []);

  return {
    voices,
    speaking,
    paused,
    speak,
    pause,
    resume,
    cancel,
    convertToAudio
  };
};

export default useSpeechSynthesis;