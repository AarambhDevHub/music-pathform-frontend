import { PlaylistProps } from "./playlists/playlists";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addTrackPlaylistSchema } from "./schema/playlistType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { addTrackPlaylists } from "@/action/playlists";
import { toast } from "sonner";

interface AddPlaylistModel {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  playlists: PlaylistProps[];
  track_id: string;
}

export const AddPlaylistModel: React.FC<AddPlaylistModel> = ({
  isOpen,
  playlists,
  setIsOpen,
  track_id,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof addTrackPlaylistSchema>>({
    resolver: zodResolver(addTrackPlaylistSchema),
    defaultValues: {
      selectedPlaylistId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addTrackPlaylistSchema>) => {
    setIsLoading(true);
    const response = await addTrackPlaylists({
      playlist_id: values.selectedPlaylistId,
      track_id: track_id,
    });

    if (response.status == "success") {
      toast.success(response.message);
      setIsOpen(false);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist from the list below to add your track.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[300px] w-full pr-4">
              <FormField
                control={form.control}
                name="selectedPlaylistId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        {playlists.map((playlist) => (
                          <div
                            key={playlist.id}
                            className="flex items-center space-x-2 mb-4"
                          >
                            <RadioGroupItem
                              value={playlist.id}
                              id={playlist.id}
                            />
                            <Label
                              htmlFor={playlist.id}
                              className="flex flex-col"
                            >
                              <span className="text-sm font-medium">
                                {playlist.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                {playlist.max_track_order} tracks
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>
            <DialogFooter>
              <Button className="w-full" isLoading={isLoading}>
                Add to Playlist
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
