"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";
import ReactAudioPlayer from "react-audio-player";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicProvider } from "./musicProvider";

const WS_URL = "wss://localhost:8000/api/history/add";

const MusicPlayer = () => {
  const { playlist, apiUrl } = useMusicProvider();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<ReactAudioPlayer>(null);

  const currentSong = playlist[currentSongIndex];
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const client = new WebSocket(WS_URL);    

    ws.current = client;
    
    ws.current.onopen = () => {
      console.log("WebSocket connection closed");
    }

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };  

    ws.current.onmessage = (message) => {
      console.log("Message from server:", message.data);
    };


    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  },[])

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;

    const intervel = setInterval(() => {
      const playedDuration = audioRef.current?.audioEl.current?.currentTime;

      if(ws.current?.readyState === ws.current?.OPEN && playedDuration !== undefined) {
        const payload = {
          track_id: currentSong.id,
          duration_played: parseInt(playedDuration.toFixed(0))
        };

        ws.current?.send(JSON.stringify(payload));
        console.log("Data sent:", payload);
      }

    },1000);

    return () => clearInterval(intervel);
  },[isPlaying, currentSong])

  useEffect(() => {
    // Start playing the first song when the playlist is updated
    if (playlist.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
      setCurrentTime(0); // Reset current time to start from the beginning
    }
  }, [playlist]);

  useEffect(() => {
    const audioElement = audioRef.current?.audioEl.current;

    if (audioElement) {
        // Set the audio source
        audioElement.src = `${apiUrl}/get/play/${currentSong.file_name}`;

        // Set the current time based on the duration played
        if (currentSong.duration_played) {
            // Only update the current time if it is less than the duration of the song
            if (currentSong.duration_played < currentSong.duration_seconds) {
                audioElement.currentTime = currentSong.duration_played;
            } else {
                // If duration_played is greater or equal, reset to the end of the song
                audioElement.currentTime = 0;
            }
        }

        // Play the audio if isPlaying is true
        if (isPlaying) {
            audioElement.play();
        }
    }
}, [currentSong, isPlaying]);


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.audioEl.current?.pause();
      } else {
        audioRef.current.audioEl.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = Math.max(0, Math.min(newVolume[0], 1)); // Clamp the volume between 0 and 1
    if (audioRef.current && audioRef.current.audioEl.current) {
      audioRef.current.audioEl.current.volume = volumeValue;
      setVolume(volumeValue);
    }
    setIsMuted(volumeValue === 0);
  };

  const handleMuteToggle = () => {
    if (audioRef.current && audioRef.current.audioEl.current) {
      const newMutedState = !isMuted;
      audioRef.current.audioEl.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.audioEl.current) {
      setCurrentTime(audioRef.current.audioEl.current.currentTime);
    }
  };

  const handleSeek = (newTime: number[]) => {
    const seekTime = newTime[0];
    setCurrentTime(seekTime);
    if (audioRef.current && audioRef.current.audioEl.current) {
      audioRef.current.audioEl.current.currentTime = seekTime;
      if (isPlaying) {
        audioRef.current.audioEl.current.play(); // Ensure audio continues playing after seeking
      }
    }
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setCurrentTime(0); // Optionally reset current time for the new song
  };

  const handlePreviousSong = () => {
    const previousIndex =
      (currentSongIndex - 1 + playlist.length) % playlist.length;
    setCurrentSongIndex(previousIndex);
    setIsPlaying(true);
    setCurrentTime(0); // Optionally reset current time for the new song
  };

  return (
    <>
      {playlist.length > 0 && (
        <div className="sticky w-full bottom-0 left-0 right-0 bg-white text-black dark:bg-black dark:text-white p-2 sm:p-4 backdrop-blur-lg bg-opacity-80 shadow-lg">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Image
                src={`${apiUrl}/assets/images/${currentSong.thumbnail_name}`}
                alt={currentSong.title}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-md"
                width={48}
                height={48}
              />
              <div className="text-center sm:text-left">
                <div className="relative overflow-hidden max-w-[200px]">
                  <h3 className="dark:text-white font-bold text-sm sm:text-base whitespace-nowrap animate-marquee">
                    {currentSong.title}
                  </h3>
                </div>
                <div className="relative overflow-hidden max-w-[200px]">
                  <p className="dark:text-gray-200 text-xs sm:text-sm ">
                    {currentSong.artist}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full sm:w-auto sm:mx-4">
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white dark:hover:text-gray-300"
                  onClick={handlePreviousSong}
                  aria-label="Previous song"
                >
                  <SkipBack className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white dark:hover:text-gray-300"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
                  ) : (
                    <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white dark:hover:text-gray-300"
                  onClick={handleNextSong}
                  aria-label="Next song"
                >
                  <SkipForward className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs dark:text-gray-300 hidden sm:inline">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={currentSong.duration_seconds}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                  aria-label="Seek"
                />
                <span className="text-xs dark:text-gray-300 hidden sm:inline">
                  {formatTime(currentSong.duration_seconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="dark:text-white dark:hover:text-gray-300"
                onClick={handleMuteToggle}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 sm:h-6 sm:w-6" />
                ) : (
                  <Volume2 className="h-4 w-4 sm:h-6 sm:w-6" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20 sm:w-24"
                aria-label="Volume"
              />
            </div>
          </div>
          <ReactAudioPlayer
            ref={audioRef}
            onListen={handleTimeUpdate}
            listenInterval={1000}
            onEnded={handleNextSong}
            volume={volume}
          />
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
