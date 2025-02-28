import React, { useState } from 'react';
import { Languages, RefreshCw } from 'lucide-react';
import { TranslationLanguage } from '../types';

interface TranslationPanelProps {
  text: string;
  isTranslating: boolean;
  onTranslate: (text: string, targetLang: string) => void;
  onUseTranslation: (translatedText: string) => void;
  translatedText: string;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  text,
  isTranslating,
  onTranslate,
  onUseTranslation,
  translatedText
}) => {
  const [targetLang, setTargetLang] = useState('bn');

  const languages: TranslationLanguage[] = [
    { code: 'bn', name: 'Bengali' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' }
  ];

  const handleTranslate = () => {
    if (text.trim() === '') return;
    onTranslate(text, targetLang);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
        <Languages className="h-5 w-5 mr-2 text-indigo-500" />
        Translation Tool
      </h3>
      
      <div className="flex items-center mb-3">
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="block w-full mr-2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleTranslate}
          disabled={text.trim() === '' || isTranslating}
          className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            text.trim() === '' || isTranslating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isTranslating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>
      </div>
      
      {translatedText && (
        <div className="mt-3">
          <div className="p-3 bg-white border rounded-md">
            <p className="text-sm text-gray-800">{translatedText}</p>
          </div>
          <div className="mt-2 text-right">
            <button
              onClick={() => onUseTranslation(translatedText)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Use this translation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationPanel;