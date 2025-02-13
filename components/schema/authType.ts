import { z } from "zod";


export const loginSchema = z.object({
    identifier: z.string()
        .min(1, { message: "Email or Username is required" })
        .email({ message: "Invalid email address" })
        .or(z.string().min(1, { message: "Username is required" })),

    password: z.string()
    .min(6, { message: "Password should be at least 6 characters long" }),
})


export const registerSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
        
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
        
    password: z.string()
        .min(6, { message: "Password should be at least 6 characters long" }),
        
    passwordConfirm: z.string()
        .min(1, { message: "Password confirmation is required" }),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
    path: ["passwordConfirm"]
});
