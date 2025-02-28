import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2, History, Download, Play, Pause, RefreshCw, Languages, Settings } from 'lucide-react';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import useTranslation from './hooks/useTranslation';
import { TextToSpeechState, HistoryItem } from './types';
import TextInput from './components/TextInput';
import VoiceSelector from './components/VoiceSelector';
import VoiceControls from './components/VoiceControls';
import AudioPlayer from './components/AudioPlayer';
import HistoryList from './components/HistoryList';
import FormatSelector from './components/FormatSelector';
import TranslationPanel from './components/TranslationPanel';

function App() {
  const { voices, speaking, paused, speak, pause, resume, cancel, convertToAudio } = useSpeechSynthesis();
  const { translate, isTranslating, translatedText, setTranslatedText } = useTranslation();
  
  const [state, setState] = useState<TextToSpeechState>({
    text: '',
    rate: 1,
    pitch: 1,
    volume: 1,
    selectedVoice: '0',
    isPlaying: false,
    isPaused: false,
    audioUrl: null,
    isConverting: false,
    history: [],
    audioFormat: 'mp3',
    translatedText: '',
    isTranslating: false
  });

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('tts-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setState(prev => ({ ...prev, history: parsedHistory }));
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tts-history', JSON.stringify(state.history));
  }, [state.history]);

  // Update isPlaying and isPaused based on the speech synthesis state
  useEffect(() => {
    setState(prev => ({ ...prev, isPlaying: speaking, isPaused: paused }));
  }, [speaking, paused]);

  // Update translated text state
  useEffect(() => {
    setState(prev => ({ ...prev, translatedText, isTranslating }));
  }, [translatedText, isTranslating]);

  const handleTextChange = (text: string) => {
    setState(prev => ({ ...prev, text }));
  };

  const handleVoiceChange = (selectedVoice: string) => {
    setState(prev => ({ ...prev, selectedVoice }));
  };

  const handleRateChange = (rate: number) => {
    setState(prev => ({ ...prev, rate }));
  };

  const handlePitchChange = (pitch: number) => {
    setState(prev => ({ ...prev, pitch }));
  };

  const handleVolumeChange = (volume: number) => {
    setState(prev => ({ ...prev, volume }));
  };

  const handleFormatChange = (audioFormat: 'mp3' | 'wav') => {
    setState(prev => ({ ...prev, audioFormat }));
  };

  const handleSpeak = () => {
    if (state.text.trim() === '') return;
    
    if (state.isPlaying) {
      if (state.isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(
        state.text,
        state.selectedVoice,
        state.rate,
        state.pitch,
        state.volume
      );
    }
  };

  const handleStop = () => {
    cancel();
  };

  const handleConvertToAudio = async () => {
    if (state.text.trim() === '') return;
    
    setState(prev => ({ ...prev, isConverting: true }));
    
    try {
      const audioUrl = await convertToAudio(
        state.text,
        state.selectedVoice,
        state.rate,
        state.pitch,
        state.volume,
        state.audioFormat
      );
      
      // Find the selected voice name
      let selectedVoiceName = 'Default Voice';
      const selectedVoiceObj = voices.find(v => v.value === state.selectedVoice);
      if (selectedVoiceObj) {
        selectedVoiceName = selectedVoiceObj.name;
      }
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        text: state.text,
        voice: selectedVoiceName,
        date: new Date(),
        audioUrl,
        format: state.audioFormat
      };
      
      setState(prev => ({ 
        ...prev, 
        audioUrl, 
        isConverting: false,
        history: [newHistoryItem, ...prev.history]
      }));
    } catch (error) {
      console.error('Failed to convert to audio:', error);
      setState(prev => ({ ...prev, isConverting: false }));
      alert('Failed to convert to audio. Please try again.');
    }
  };

  const handleDownload = useCallback(() => {
    if (!state.audioUrl) return;
    
    const link = document.createElement('a');
    link.href = state.audioUrl;
    link.download = `speech-${Date.now()}.${state.audioFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.audioUrl, state.audioFormat]);

  const handlePlayHistoryItem = (item: HistoryItem) => {
    setState(prev => ({ ...prev, audioUrl: item.audioUrl }));
  };

  const handleDownloadHistoryItem = (item: HistoryItem) => {
    const link = document.createElement('a');
    link.href = item.audioUrl;
    link.download = `speech-${Date.now()}.${item.format || 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== id)
    }));
  };

  const handleTranslate = (text: string, targetLang: string) => {
    translate(text, targetLang);
  };

  const handleUseTranslation = (translatedText: string) => {
    setState(prev => ({ ...prev, text: translatedText }));
    setTranslatedText('');
  };

  const [activeTab, setActiveTab] = useState<'convert' | 'history' | 'settings'>('convert');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <Mic className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">Advanced Text to Speech</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'convert'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('convert')}
            >
              <div className="flex items-center justify-center">
                <Volume2 className="h-5 w-5 mr-2" />
                <span>Convert Text</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <div className="flex items-center justify-center">
                <History className="h-5 w-5 mr-2" />
                <span>History</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'settings'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="flex items-center justify-center">
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'convert' ? (
              <div>
                <TextInput text={state.text} onTextChange={handleTextChange} />
                
                <TranslationPanel 
                  text={state.text}
                  isTranslating={state.isTranslating}
                  onTranslate={handleTranslate}
                  onUseTranslation={handleUseTranslation}
                  translatedText={state.translatedText}
                />
                
                <VoiceSelector
                  voices={voices}
                  selectedVoice={state.selectedVoice}
                  onVoiceChange={handleVoiceChange}
                />
                
                <VoiceControls
                  rate={state.rate}
                  pitch={state.pitch}
                  volume={state.volume}
                  onRateChange={handleRateChange}
                  onPitchChange={handlePitchChange}
                  onVolumeChange={handleVolumeChange}
                />
                
                <FormatSelector 
                  format={state.audioFormat}
                  onFormatChange={handleFormatChange}
                />
                
                <div className="flex space-x-3 mb-6">
                  <button
                    onClick={handleSpeak}
                    disabled={state.text.trim() === ''}
                    className={`flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      state.text.trim() === ''
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    {state.isPlaying ? (
                      state.isPaused ? (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          <span>Pause</span>
                        </>
                      )
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        <span>Speak</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleStop}
                    disabled={!state.isPlaying}
                    className={`py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                      !state.isPlaying
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    Stop
                  </button>
                  
                  <button
                    onClick={handleConvertToAudio}
                    disabled={state.text.trim() === '' || state.isConverting}
                    className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      state.text.trim() === '' || state.isConverting
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                  >
                    {state.isConverting ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        <span>Generate {state.audioFormat.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <AudioPlayer 
                  audioUrl={state.audioUrl} 
                  isConverting={state.isConverting}
                  onDownload={handleDownload}
                />
              </div>
            ) : activeTab === 'history' ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Conversion History</h2>
                <HistoryList
                  history={state.history}
                  onPlay={handlePlayHistoryItem}
                  onDownload={handleDownloadHistoryItem}
                  onDelete={handleDeleteHistoryItem}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Audio Format</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose your preferred audio format for downloads.
                    </p>
                    <FormatSelector 
                      format={state.audioFormat}
                      onFormatChange={handleFormatChange}
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Language Support</h3>
                    <p className="text-sm text-gray-600">
                      This application supports multiple languages including Bengali, Hindi, Arabic, and many more.
                      Use the translation tool to convert your text to different languages before generating speech.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-medium text-gray-900 mb-2">About Voice Options</h3>
                    <p className="text-sm text-gray-600">
                      The available voices depend on your browser and operating system. 
                      We've added custom support for Bengali and other languages that might not be natively available.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Enhanced Features</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">✓</span>
              <span><strong>Bengali Language Support</strong> - Now with dedicated Bengali voice option</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">✓</span>
              <span><strong>Multiple Audio Formats</strong> - Download as MP3 or WAV files</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">✓</span>
              <span><strong>Translation Tool</strong> - Translate your text before converting to speech</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">✓</span>
              <span><strong>Voice Customization</strong> - Adjust rate, pitch, and volume for perfect output</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-500 mr-2">✓</span>
              <span><strong>Conversion History</strong> - Save and access your previous conversions</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Advanced Text to Speech Converter &copy; {new Date().getFullYear()}</p>
          <p className="text-gray-400 text-sm mt-2">
            Uses the Web Speech API with enhanced language support
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;