"use client";

import { Star } from "lucide-react";
import { Home, TrackProps } from "./Home";
import { PlaylistProps } from "./playlists/playlists";

interface FavoritesProps {
  tracks: TrackProps[];
  API_BASE_URL: string;
  playlists: PlaylistProps[];
}

export const Favorites: React.FC<FavoritesProps> = ({
  API_BASE_URL,
  playlists,
  tracks,
}) => {
  return (
    <>
      {tracks.length != 0 ? (
        <Home
          API_BASE_URL={API_BASE_URL as string}
          tracks={tracks}
          playlists={playlists}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <Star className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold mb-2">No favorites found</p>
        </div>
      )}
    </>
  );
};
