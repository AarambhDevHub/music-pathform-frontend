import { z } from "zod";
import { ALLOWED_IMAGE_TYPES } from "./uploadType";

export const createdPlaylistSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  thumbnail: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file format. Only image files are allowed.",
    }),
});

export const addTrackPlaylistSchema = z.object({
  selectedPlaylistId: z.string().min(1, "Please select a playlist"),
});
