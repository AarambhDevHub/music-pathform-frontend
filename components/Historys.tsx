"use client";

import { useEffect, useState } from "react";
import { TrackProps } from "./Home";
import { Clock, Play } from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useMusicProvider } from "./music/musicProvider";

interface HisotryProps {
  tracks: TrackProps[];
  API_BASE_URL: string;
}

export const Hisotry: React.FC<HisotryProps> = ({ API_BASE_URL, tracks }) => {
  const [currentTime, setCurrentTime] = useState("");

  const { setPlaylist, setApiUrl } = useMusicProvider();

  useEffect(() => {
    setApiUrl(API_BASE_URL);
  },[setApiUrl, API_BASE_URL])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      )
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format options for date and time
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Set to true for 12-hour format, false for 24-hour format
    };

    // Combine formatted date and time
    const formattedDate = date.toLocaleDateString([], dateOptions);
    const formattedTime = date.toLocaleTimeString([], timeOptions);

    return `${formattedDate} ${formattedTime}`;
  };

  const onPlayHanlder = (track: TrackProps) => {
    setPlaylist([{...track}, ...tracks.filter((t) => t.id !== track.id)])
  }

  return (
    <div className="">
      {tracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="flex flex-col sm:flex-row items-center p-4"
            >
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                <Image
                  src={`${API_BASE_URL}/assets/images/${track.thumbnail_name}`}
                  alt={`${track.title} thumbnail`}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <h3 className="font-semibold text-lg mb-1">{track.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {track.artist}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Played at {formatDate(track.played_at)}
                  </span>
                  <Button size="sm" className="ml-2" onClick={() => onPlayHanlder(track)}>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
                <Progress
                  value={(track.duration_played / track.duration_seconds) * 100}
                  className="h-1 mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDuration(track.duration_played)}</span>
                  <span>{formatDuration(track.duration_seconds)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <Clock className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold mb-2">No tracks played yet</p>
          <p className="text-muted-foreground">
            Current time:{" "}
            {currentTime}
          </p>
        </div>
      )}
    </div>
  );
};
