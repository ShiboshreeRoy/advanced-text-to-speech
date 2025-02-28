import React from 'react';
import { AlignLeft } from 'lucide-react';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ text, onTextChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
        Enter Text
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3">
          <AlignLeft className="h-5 w-5 text-gray-400" />
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type or paste text here to convert to speech..."
          className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md min-h-[150px]"
        />
      </div>
      <div className="mt-1 text-right text-xs text-gray-500">
        {text.length} characters
      </div>
    </div>
  );
};

export default TextInput;