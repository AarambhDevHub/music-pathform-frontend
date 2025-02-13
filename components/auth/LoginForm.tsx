"use client";

import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginSchema } from "../schema/authType";
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthCard } from "./AuthCard"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useTransition } from "react";
import { LoginApi } from "@/action/authHandler";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";


export const LoginForm = () => {
    const [isPanding, startTransition] = useTransition();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        startTransition(() => {
            LoginApi(values)
                .then((response) => {
                    if (response.status != 'success') {
                        toast.error(response.message)
                    }
                })
                .catch((error) => {
                    console.log(error,'error')
                    // toast.error(error)
                })
        })
    }
    
    return (
        <AuthCard
            headerLabel="Welcome Back"
            backButtonHref="/register"
            backButtonLabel="Don't have an account?"
        >
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField 
                        control={form.control}
                        name='identifier'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Username</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder="john.doe@example.com"
                                        disabled={isPanding}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="*******"
                                        disabled={isPanding}
                                        enablePasswordToggle
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" isLoading={isPanding} className="w-full">
                        Login
                </Button>
            </form>
        </Form>
        </AuthCard>
    )
}