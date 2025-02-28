import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Play, Download, Trash2, FileAudio } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onPlay: (item: HistoryItem) => void;
  onDownload: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onPlay, 
  onDownload, 
  onDelete 
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
        <p>Your conversion history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={item.id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 mr-2">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.text}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{new Date(item.date).toLocaleString()}</span>
                <span className="mx-1">•</span>
                <span>{item.voice}</span>
                {item.format && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <FileAudio className="h-3 w-3 mr-1" />
                      {item.format.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onPlay(item)}
                className="p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                title="Play"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDownload(item)}
                className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;