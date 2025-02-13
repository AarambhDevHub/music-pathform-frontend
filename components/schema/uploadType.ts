import { z } from "zod";

export const fileSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file !== undefined, {
            message: "File is required"
        })
        .refine((file) => file.type.startsWith("audio/"), {
            message: "Only audio files are accepted",
        })
        
})

export const trackSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    artist: z.string().min(1, { message: "Artist is required" }),
});

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg", 
    "image/png", 
    "image/gif", 
    "image/webp", 
    "image/svg+xml", 
    "image/bmp", 
    "image/tiff"
];

export const thumbnailSchema = z.object({
    thumbnail: z.instanceof(File)
        .refine(file => ALLOWED_IMAGE_TYPES.includes(file.type), {
        message: "Invalid file format. Only image files are allowed.",
        })
});
  

export const ResumefileSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file !== undefined, {
            message: "File is required"
        })
        .refine((file) => file.type.startsWith("audio/"), {
            message: "Only audio files are accepted",
        })
        
})

export const editMusicSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    artist: z.string().min(1, { message: "Artist is required" }),
    thumbnail: z.instanceof(File)
        .refine(file => ALLOWED_IMAGE_TYPES.includes(file.type), {
        message: "Invalid file format. Only image files are allowed.",
        })
})