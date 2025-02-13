import { useForm } from "react-hook-form";
import { z } from "zod";
import { thumbnailSchema } from "../schema/uploadType";
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
import { DragEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import Image from "next/image";

interface UploadThumbnailProps {
  prevStep: () => void;
  track_data: {
    title: string;
    artist: string;
  };
  track_id: string;
  API_BASE_URL: string;
  uploadProgress: number;
}

export const UploadThumbnail: React.FC<UploadThumbnailProps> = ({
  prevStep,
  track_data,
  API_BASE_URL,
  track_id,
  uploadProgress,
}) => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const [uploadCompleted, setUploadCompleted] = useState(false); // Track upload progress completion
  const [apiSuccess, setApiSuccess] = useState(false); // Track API success completion
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof thumbnailSchema>>({
    resolver: zodResolver(thumbnailSchema),
  });

  useEffect(() => {
    setUploadCompleted(uploadProgress === 100);
  }, [uploadProgress]);

  useEffect(() => {
    if (uploadCompleted && apiSuccess) {
      router.push("/home");
    }
  }, [uploadCompleted, apiSuccess, router]);

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

  const onSubmit = async (values: z.infer<typeof thumbnailSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("track_id", track_id);
    formData.append("title", track_data.title);
    formData.append("artist", track_data.artist);
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

      setApiSuccess(true);

      if (uploadCompleted && apiSuccess) {
        router.push("/home"); // Redirect only when both are completed
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
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thumbnail"
          render={({}) => (
            <FormItem>
              <FormControl>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50 transition-colors
                    ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25"
                    } ${
                    form.formState.errors.thumbnail &&
                    "border-destructive bg-destructive/10"
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
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={isloading}
            onClick={prevStep}
          >
            Previous
          </Button>
          <Button type="submit" isLoading={isloading} className="ml-auto">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
