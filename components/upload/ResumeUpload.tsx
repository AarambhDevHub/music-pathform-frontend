"use client";

import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResumefileSchema } from "../schema/uploadType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import Image from "next/image";
import { Music } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Logout } from "@/action/authHandler";
import { CHUNK_SIZE } from "./uploadFile";
import { useRouter } from "next/navigation";

interface incompleteTrackInfoProps {
  title: string;
  artist: string;
  thumbnail_name: string;
  file_name: string;
  track_id: string;
  total_chunks: string;
  current_chunk: string;
}

interface ResumeUploadFile {
  data: incompleteTrackInfoProps[];
  API_BASE_URL: string;
}

export const ResumeUploadFile: React.FC<ResumeUploadFile> = ({
  data,
  API_BASE_URL,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ResumefileSchema>>({
    resolver: zodResolver(ResumefileSchema),
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0]);
    }
  };

  const onSubmit = async (
    values: z.infer<typeof ResumefileSchema>,
    track: incompleteTrackInfoProps
  ) => {
    console.log(track,'track')
    setIsLoading(true);
    const file = values.file;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = parseInt(track.current_chunk) + 1;
    const track_id = track.track_id;
    if (totalChunks != parseInt(track.total_chunks)) {
        setIsLoading(false);
        return;
    }
    console.log("inSubmit")
    console.log(currentChunk, "currentChunk")
    console.log(track.current_chunk, "track.current_chuck")

    while (currentChunk < totalChunks) {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chuck = file.slice(start, end);
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("chunkNumber", currentChunk.toString());
      formData.append("totalChunks", totalChunks.toString());
      formData.append("chunk", chuck);
      formData.append("trackId", track_id);

      try {
        const result = await fetch(`${API_BASE_URL}/upload`, {
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
          setIsLoading(false);
          break; // Break on error
        }

        currentChunk++;
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
        break; // Break on any caught error
      }
    }
    setIsLoading(false);
    router.refresh();
  };

  return (
    <div>
      {data.map((track) => (
        <div key={track.track_id}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((value) => onSubmit(value, track))}
            >
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Upload Audio Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      {track.thumbnail_name ? (
                        <Image
                          src={`${API_BASE_URL}/assets/images/${track.thumbnail_name}?height=64&width=64`}
                          alt="Audio thumbnail"
                          className="w-full h-full object-cover rounded-md"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <Music className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{track.title || 'Untitled'}</h3>
                      <p className="text-sm text-gray-500">{track.artist || 'Unknown Artist'}</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Select the file with the `{track.file_name}` to upload
                          your resume
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="audio-file"
                            type="file"
                            accept="audio/*"
                            ref={field.ref}
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Upload Resume
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      ))}
    </div>
  );
};
