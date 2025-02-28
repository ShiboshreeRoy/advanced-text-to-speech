import React from 'react';
import { VoiceOption } from '../types';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  voices, 
  selectedVoice, 
  onVoiceChange 
}) => {
  // Group voices by language
  const voicesByLang = voices.reduce((acc: Record<string, VoiceOption[]>, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {});

  // Sort languages alphabetically
  const sortedLangs = Object.keys(voicesByLang).sort();

  // Get language display names
  const getLanguageName = (langCode: string) => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
    } catch (error) {
      return langCode;
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Voice
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mic className="h-5 w-5 text-gray-400" />
        </div>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {voices.length === 0 ? (
            <option value="">Loading voices...</option>
          ) : (
            <>
              {sortedLangs.map((lang) => (
                <optgroup key={lang} label={getLanguageName(lang)}>
                  {voicesByLang[lang].map((voice) => (
                    <option key={voice.value} value={voice.value}>
                      {voice.name} 
                      {voice.customVoice ? " (Custom)" : voice.accent ? ` (${voice.accent})` : ''} 
                      {voice.default ? " - Default" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
};

export default VoiceSelector;