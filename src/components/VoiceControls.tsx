import React from 'react';
import { Volume2, Gauge, Music } from 'lucide-react';

interface VoiceControlsProps {
  rate: number;
  pitch: number;
  volume: number;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
  onVolumeChange: (volume: number) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  rate,
  pitch,
  volume,
  onRateChange,
  onPitchChange,
  onVolumeChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="rate-slider" className="flex items-center text-sm font-medium text-gray-700">
            <Gauge className="h-4 w-4 mr-1" />
            <span>Rate: {rate.toFixed(1)}</span>
          </label>
          <span className="text-xs text-gray-500">Speed</span>
        </div>
        <input
          id="rate-slider"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => onRateChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Slow</span>
          <span>Normal</span>
          <span>Fast</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="pitch-slider" className="flex items-center text-sm font-medium text-gray-700">
            <Music className="h-4 w-4 mr-1" />
            <span>Pitch: {pitch.toFixed(1)}</span>
          </label>
          <span className="text-xs text-gray-500">Tone</span>
        </div>
        <input
          id="pitch-slider"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => onPitchChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Normal</span>
          <span>High</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="volume-slider" className="flex items-center text-sm font-medium text-gray-700">
            <Volume2 className="h-4 w-4 mr-1" />
            <span>Volume: {(volume * 100).toFixed(0)}%</span>
          </label>
        </div>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Mute</span>
          <span>50%</span>
          <span>Max</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;