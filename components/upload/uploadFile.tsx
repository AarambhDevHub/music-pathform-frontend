import { useForm } from "react-hook-form";
import { z } from "zod";
import { fileSchema } from "../schema/uploadType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Logout } from "@/action/authHandler";
import { DragEvent, useRef, useState } from "react";
import { CheckCircle, Music, Upload } from "lucide-react";

interface UploadFileProps {
  nextStep: () => void;
  setUploadProgress: (value: number) => void;
  setTrackId: (value: string) => void;
  API_BASE_URL: string;
}

export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size

export const UploadFile: React.FC<UploadFileProps> = ({
  nextStep,
  setUploadProgress,
  setTrackId,
  API_BASE_URL,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
  });

  const onSubmit = async (values: z.infer<typeof fileSchema>) => {
    setIsLoading(true);
    const file = values.file;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;
    setUploadProgress(0);
    let track_id = null;

    while (currentChunk < totalChunks) {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chuck = file.slice(start, end);
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("chunkNumber", currentChunk.toString());
      formData.append("totalChunks", totalChunks.toString());
      formData.append("chunk", chuck);
      if (track_id != null) {
        formData.append("trackId", track_id);
      }

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
          break; // Break on error
        }

        const response = await result.json();
        if (currentChunk === 0) {
          // Fix typo from 1 to 0
          setTrackId(response.track_id); // Corrected from tract_id
          track_id = response.track_id;
          nextStep();
        }

        currentChunk++;
        setUploadProgress(
          parseInt(((currentChunk / totalChunks) * 100).toFixed(0))
        );
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
        break; // Break on any caught error
      }
    }

    // Uncomment to proceed to the next step after upload completion
    // setUploadProgress(10);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    form.setValue("file", file);
  };

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
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      form.setValue("file", droppedFile);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-secondary/50 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25"
                } ${
                  form.formState.errors.file &&
                  "border-destructive/100 bg-destructive/10"
                } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {!field.value ? (
                  <>
                    <Upload
                      className={`mx-auto h-12 w-12 
                         ${
                           form.formState.errors.file
                             ? "text-destructive-foreground"
                             : "text-muted-foreground"
                         }
                        `}
                    />
                    <p
                      className={`mt-2 text-sm 
                         ${
                           form.formState.errors.file
                             ? "text-destructive-foreground"
                             : "text-muted-foreground"
                         }
                        `}
                    >
                      Drag and drop your audio file here, or click to select a
                      file
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                    <p className="mt-2 text-sm text-primary">
                      File selected: {field.value.name}
                    </p>
                  </>
                )}
              </div>
              <FormControl>
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </FormControl>
              {field.value && (
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {field.value.name}
                  </span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-8 flex justify-between">
          <Button type="submit" className="ml-auto" isLoading={isLoading}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
