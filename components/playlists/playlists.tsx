"use client";

import { ListMusic, Play, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlayListForm } from "./playlistsForm";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { getPlaylistsTracks } from "@/action/playlists";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { useMusicProvider } from "../music/musicProvider";

export interface PlaylistProps {
  id: string;
  title: string;
  thumbnail_path: string;
  max_track_order: number;
}

interface PlaylistsProps {
  playlists: PlaylistProps[];
  API_BASE_URL: string;
}

export const Playlists: React.FC<PlaylistsProps> = ({
  API_BASE_URL,
  playlists,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setPlaylist, setApiUrl } = useMusicProvider();

  useEffect(() => {
    setApiUrl(API_BASE_URL);
  }, [API_BASE_URL, setApiUrl]);

  const onPlayListTrackHandler = async (id: string) => {
    const response = await getPlaylistsTracks({ playlist_id: id });
    console.log()
    if (response?.tracks.length > 0) {
        setPlaylist(response.tracks);
    } else {
        toast.warning("The playlist is empty. Please add songs to the playlist.")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-end">
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[450px] px-4">
              <PlayListForm API_BASE_URL={API_BASE_URL} setIsOpen={setIsOpen} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      {playlists.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="overflow-hidden">
            <CardContent className="p-0 aspect-square relative group">
              <Image
                src={`${API_BASE_URL}/assets/playlist/${playlist.thumbnail_path}`}
                alt={playlist.title}
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onPlayListTrackHandler(playlist.id)}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-2">
              <div>
                <h3 className="font-semibold truncate">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {playlist.max_track_order} songs
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <ListMusic className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold mb-2">Playlist not created yet</p>
          {/* <p className="text-muted-foreground">
            Current time:{" "}
            {currentTime}
          </p> */}
      </div>

      )}
    </div>
  );
};
