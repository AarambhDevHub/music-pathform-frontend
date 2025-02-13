"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { TrackProps } from "../Home";

const MusicContext = createContext<{
  playlist: TrackProps[];
  setPlaylist: React.Dispatch<React.SetStateAction<TrackProps[]>>;
  apiUrl: string;
  setApiUrl: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<TrackProps[]>([]);
  const [apiUrl, setApiUrl] = useState<string>("");

  return (
    <MusicContext.Provider value={{ playlist, setPlaylist, apiUrl, setApiUrl }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicProvider = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicProvider must be used within a MusicProvider");
  }
  return context;
};
