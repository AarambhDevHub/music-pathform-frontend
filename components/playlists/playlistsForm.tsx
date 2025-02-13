import { useForm } from "react-hook-form";
import { z } from "zod";
import { createdPlaylistSchema } from "../schema/playlistType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DragEvent, useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Logout } from "@/action/authHandler";
import { toast } from "sonner";
// import { useRouter } from "next/router";

interface PlaylistForm {
  API_BASE_URL: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const PlayListForm: React.FC<PlaylistForm> = ({
  API_BASE_URL,
  setIsOpen,
}) => {
  const [isloading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const router = useRouter();

  const form = useForm<z.infer<typeof createdPlaylistSchema>>({
    resolver: zodResolver(createdPlaylistSchema),
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      form.setValue("thumbnail", file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    form.setValue("thumbnail", file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const onSubmit = async (values: z.infer<typeof createdPlaylistSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("thumbnail", values.thumbnail);

    try {
      const result = await fetch(`${API_BASE_URL}/playlist`, {
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

      console.log(response);
      if (response.status == "success") {
        toast.success(response.message);
        setIsOpen(false);
        form.reset();
        // router.reload();
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
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
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playlist name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter playlist name"
                  disabled={isloading}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={({}) => (
            <FormItem>
              <FormLabel>Playlist Thumbnail</FormLabel>
              <FormControl>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50 transition-colors
                    ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25"
                    } ${
                    form.formState.errors.thumbnail &&
                    "border-destructive/100 bg-destructive/10"
                  } ${isloading ? "opacity-50 pointer-events-none" : ""}
                    `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={previewUrl as string}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload
                        className={`h-10 w-10 mb-2 
                            ${
                              form.formState.errors.thumbnail
                                ? "text-destructive-foreground"
                                : "text-muted-foreground"
                            }
                        `}
                      />
                      <p
                        className={`text-sm 
                            ${
                              form.formState.errors.thumbnail
                                ? "text-destructive-foreground"
                                : "text-muted-foreground"
                            }
                        `}
                      >
                        Drag and drop or click to upload thumbnail
                      </p>
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    id="thumbnail"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isloading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={isloading} className="w-full">
          Create Playlist
        </Button>
      </form>
    </Form>
  );
};
