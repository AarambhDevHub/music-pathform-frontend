import { useState } from "react";
import { TrackProps } from "./Home";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editMusicSchema } from "./schema/uploadType";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Logout } from "@/action/authHandler";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface EditMusicModel {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  track: TrackProps;
  API_BASE_URL: string;
}

export const MusicEditModel: React.FC<EditMusicModel> = ({
  isOpen,
  setIsOpen,
  track,
  API_BASE_URL
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof editMusicSchema>>({
    resolver: zodResolver(editMusicSchema),
    defaultValues: {
      artist: track.artist,
      title: track.title,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    form.setValue("thumbnail", file);
  };

  const onSubmit = async (values: z.infer<typeof editMusicSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("track_id", track.id);
    formData.append("title", values.title);
    formData.append("artist", values.artist);
    formData.append("thumbnail", values.thumbnail);

    try {
      const result = await fetch(`${API_BASE_URL}/upload/thumbnail`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (result.status === 401) {
        Logout();
        return; // Stop further processing after logout
      }

      if (!result.ok) {
        const errorText = await result.text(); // Read response body for details
        console.error(`Error uploading chunk: ${result.status} ${errorText}`);
      }

      const response = await result.json();

      if (response.status == "success") {
        toast.success(response.message);
        setIsOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          console.log("here 401");
          Logout();
        } else {
          console.error("Error during fetch:", error.message);
        }
      } else {
        console.error("An unknown error occurred", error);
      }
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist from the list below to add your track.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter song title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Artist</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter song artist"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button isLoading={isLoading} className="w-full">
                Updated details
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
