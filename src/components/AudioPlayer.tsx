import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, RefreshCw } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  isConverting: boolean;
  onDownload: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, isConverting, onDownload }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (isConverting) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-lg bg-gray-50">
        <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
        <span className="text-gray-700">Converting to audio...</span>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-lg bg-gray-50">
        <span className="text-gray-500">No audio generated yet</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center mb-2">
        <button 
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <button 
          onClick={onDownload}
          className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          title="Download audio"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;