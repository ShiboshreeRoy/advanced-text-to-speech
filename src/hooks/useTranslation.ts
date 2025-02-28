import { useState, useCallback } from 'react';

// This is a mock translation service since we can't use external APIs directly
// In a real application, you would use a proper translation API
const mockTranslate = async (text: string, targetLang: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock translations for demonstration
  const mockTranslations: Record<string, Record<string, string>> = {
    'bn': {
      'hello': 'হ্যালো',
      'how are you': 'আপনি কেমন আছেন',
      'welcome': 'স্বাগতম',
      'thank you': 'ধন্যবাদ',
      'good morning': 'শুভ সকাল',
      'good night': 'শুভ রাত্রি'
    },
    'hi': {
      'hello': 'नमस्ते',
      'how are you': 'आप कैसे हैं',
      'welcome': 'स्वागत है',
      'thank you': 'धन्यवाद',
      'good morning': 'सुप्रभात',
      'good night': 'शुभ रात्रि'
    }
  };
  
  // Check if we have a mock translation
  const lowerText = text.toLowerCase();
  if (mockTranslations[targetLang] && mockTranslations[targetLang][lowerText]) {
    return mockTranslations[targetLang][lowerText];
  }
  
  // For Bengali, add some Bengali characters to simulate translation
  if (targetLang === 'bn') {
    return `${text} (বাংলা অনুবাদ)`;
  }
  
  // For other languages, just return the original with a note
  return `${text} (translated to ${targetLang})`;
};

const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  
  const translate = useCallback(async (text: string, targetLang: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await mockTranslate(text, targetLang);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  }, []);
  
  return {
    translate,
    isTranslating,
    translatedText,
    setTranslatedText
  };
};

export default useTranslation;