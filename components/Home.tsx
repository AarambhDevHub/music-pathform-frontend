"use client";

import { useEffect, useState } from "react";
import { deletefavorite, savefavorite } from "@/action/favoritesHandler";
import { toast } from "sonner";
import { MusicCard } from "./music/MusicCard";
import { usePathname } from "next/navigation";
import { PlaylistProps } from "./playlists/playlists";
import { useMusicProvider } from "./music/musicProvider";

export interface TrackProps {
  id: string;
  title: string;
  artist: string;
  duration_minutes: number;
  duration_seconds: number;
  duration_played: number;
  file_name: string;
  thumbnail_name: string;
  is_favorite: boolean;
  played_at: string;
  is_created_by_user: boolean;
}

interface HomeProps {
  tracks: TrackProps[];
  API_BASE_URL: string;
  playlists: PlaylistProps[];
}

export const Home = ({ tracks, API_BASE_URL, playlists }: HomeProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();

  const { setPlaylist, setApiUrl } = useMusicProvider();

  useEffect(() => {
    setApiUrl(API_BASE_URL);
    tracks.map((t) => t.is_favorite && setFavorites((prev) => [...prev, t.id]));
  }, [API_BASE_URL, setApiUrl, tracks]);

  const toggleFavorite = async (id: string) => {
    setIsLoading(true);
    const isFavorite = favorites.includes(id);
    let response;

    if (isFavorite) {
      response = await deletefavorite({ track_id: id, pathName });
    } else {
      response = await savefavorite({ track_id: id });
    }

    if (response.status == "success") {
      console.log(response, "response");
      toast.success(response.message);
      
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      );
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const playClickHanlder = (track: TrackProps) => {
    const tracks_playlist = [track, ...tracks.filter((t) => t.id !== track.id)];
    setPlaylist(tracks_playlist);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <MusicCard 
          API_BASE_URL={API_BASE_URL} 
          favorites={favorites} 
          isLoading={isLoading}
          playClickHanlder={playClickHanlder}
          toggleFavorite={toggleFavorite}
          track={track}
          key={track.id}
          playlists={playlists}
        />
      ))}
    </div>
  );
};
