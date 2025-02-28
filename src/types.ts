export interface VoiceOption {
  name: string;
  lang: string;
  value: string;
  accent?: string;
  default?: boolean;
  customVoice?: boolean;
}

export interface TextToSpeechState {
  text: string;
  rate: number;
  pitch: number;
  volume: number;
  selectedVoice: string;
  isPlaying: boolean;
  isPaused: boolean;
  audioUrl: string | null;
  isConverting: boolean;
  history: HistoryItem[];
  audioFormat: 'mp3' | 'wav';
  translatedText: string;
  isTranslating: boolean;
}

export interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  date: Date;
  audioUrl: string;
  format: string;
}

export interface TranslationLanguage {
  code: string;
  name: string;
}