import { TrackProps } from "../Home";
import Image from "next/image";
import { Edit2, Heart, ListPlus, Loader2, Music, Play } from "lucide-react";
import { Button } from "../ui/button";
import { PlaylistProps } from "../playlists/playlists";
import { AddPlaylistModel } from "../AddPlaylistModel";
import { useState } from "react";
import { MusicEditModel } from "../MusicEditModel";

interface MusicCardProps {
  track: TrackProps;
  API_BASE_URL: string;
  toggleFavorite: (id: string) => void;
  isLoading: boolean;
  favorites: string[];
  playClickHanlder: (track: TrackProps) => void;
  playlists: PlaylistProps[];
}

export const MusicCard: React.FC<MusicCardProps> = ({
  track,
  API_BASE_URL,
  favorites,
  isLoading,
  playClickHanlder,
  toggleFavorite,
  playlists,
}) => {
  const [listIsOpen, setListIsOpen] = useState(false);
  const [EditisOpen, setEditIsOpen] = useState(false);
  return (
    <div
      key={track.id}
      className="relative w-[300px] h-[300px] rounded-lg overflow-hidden group"
    >
      {track.thumbnail_name ? (
        <Image
          src={`${API_BASE_URL}/assets/images/${track.thumbnail_name}`}
          alt={track.title}
          className="w-full h-full object-cover"
          width={300}
          height={300}
        />
      ) : (
        <Music className="w-[300px] h-[300px] text-gray-400" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-purple-400 transition-colors duration-200"
            onClick={() => setListIsOpen(!listIsOpen)}
          >
            <ListPlus className="h-5 w-5" />
          </Button>
          {track.is_created_by_user && <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-purple-400 transition-colors duration-200"
            onClick={() => setEditIsOpen(!EditisOpen)}
          >
            <Edit2 className="h-5 w-5" />
          </Button>}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-semibold mb-1 truncate text-white">
          {track.title || "Untitled"}
        </h3>
        <p className="text-sm text-gray-300 mb-1 truncate">
          {track.artist || "Unknown Artist"}
        </p>
        <p className="text-xs text-gray-400 mb-2">
          {track.duration_minutes.toFixed(2)} min
        </p>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-purple-400 transition-colors duration-200"
            onClick={() => toggleFavorite(track.id)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
              </>
            ) : (
              <>
                <Heart
                  className={`h-6 w-6 ${
                    favorites.includes(track.id)
                      ? "fill-current text-red-500"
                      : ""
                  }`}
                />
                <span className="sr-only">
                  {favorites.includes(track.id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => playClickHanlder(track)}
            className="text-white hover:text-purple-400 transition-colors duration-200"
          >
            <Play className="h-6 w-6 fill-current" />
            <span className="sr-only">Play</span>
          </Button>
        </div>
      </div>
      <AddPlaylistModel
        playlists={playlists}
        isOpen={listIsOpen}
        setIsOpen={setListIsOpen}
        track_id={track.id}
      />
      <MusicEditModel 
        isOpen={EditisOpen}
        setIsOpen={setEditIsOpen}
        track={track}
        API_BASE_URL={API_BASE_URL}
      />
    </div>
  );
};
