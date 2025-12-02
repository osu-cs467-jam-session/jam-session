
'use client'; 

import React, { useState, useRef, useEffect } from "react";

type AudioPlayerProps = { 
  url: string;          
  title?: string;         
}; 

export default function AudioPlayer({ url, title }: AudioPlayerProps) { 
  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 

  const formatTime = (sec: number) => { 
    const m = Math.floor(sec / 60); 
    const s = Math.floor(sec % 60); 
    return `${m}:${s.toString().padStart(2, "0")}`; 
  }; 

  useEffect(() => { 
    const audio = audioRef.current; 
    if (!audio) return; 

    const handleLoaded = () => { 
      setIsLoading(false); 
      setDuration(audio.duration); 
    }; 

    const handleTimeUpdate = () => { 
      setCurrentTime(audio.currentTime); 
    }; 

    audio.addEventListener("loadedmetadata", handleLoaded); 
    audio.addEventListener("timeupdate", handleTimeUpdate); 

    return () => { 
      audio.removeEventListener("loadedmetadata", handleLoaded); 
      audio.removeEventListener("timeupdate", handleTimeUpdate); 
    }; 
  }, []); 

  const togglePlay = () => { 
    const audio = audioRef.current; 
    if (!audio) return; 
    if (isPlaying) { 
      audio.pause(); 
      setIsPlaying(false); 
    } else { 
      audio.play(); 
      setIsPlaying(true); 
    } 
  }; 

  return ( 
    <div className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"> {/* NEW */}
      
      {title && ( 
        <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"> {/* NEW */}
          {title} {/* NEW */}
        </p> 
      )} 

      {isLoading ? ( 
        <p className="text-xs text-gray-500">Loading audio…</p> 
      ) : ( 
        <div className="flex flex-col gap-2"> {/* NEW */}

          {/* NEW — Play/Pause Button */}
          <button
            onClick={togglePlay} 
            className="px-3 py-1 w-24 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          > {/* NEW */}
            {isPlaying ? "Pause" : "Play"} {/* NEW */}
          </button>

          {/* NEW — Progress Bar */}
          <input
            type="range" 
            min={0} 
            max={duration} 
            value={currentTime} 
            onChange={(e) => { 
              const newTime = Number(e.target.value); 
              setCurrentTime(newTime); 
              if (audioRef.current) audioRef.current.currentTime = newTime; 
            }}
            className="w-full"
          />

          <div className="text-xs text-gray-600 dark:text-gray-400"> 
            {formatTime(currentTime)} / {formatTime(duration)} 
          </div>
        </div>
      )}

      <audio ref={audioRef} src={url} preload="metadata" /> {/* NEW */}
    </div>
  );
}
