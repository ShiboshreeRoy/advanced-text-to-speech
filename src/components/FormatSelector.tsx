import React from 'react';
import { FileAudio } from 'lucide-react';

interface FormatSelectorProps {
  format: 'mp3' | 'wav';
  onFormatChange: (format: 'mp3' | 'wav') => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Audio Format
      </label>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            id="format-mp3"
            type="radio"
            name="format"
            value="mp3"
            checked={format === 'mp3'}
            onChange={() => onFormatChange('mp3')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor="format-mp3" className="ml-2 block text-sm text-gray-700 flex items-center">
            <FileAudio className="h-4 w-4 mr-1" />
            MP3
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="format-wav"
            type="radio"
            name="format"
            value="wav"
            checked={format === 'wav'}
            onChange={() => onFormatChange('wav')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor="format-wav" className="ml-2 block text-sm text-gray-700 flex items-center">
            <FileAudio className="h-4 w-4 mr-1" />
            WAV
          </label>
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;