import { useForm } from "react-hook-form"
import { z } from "zod"
import { trackSchema } from "../schema/uploadType"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import React from "react"

interface UploadTrackProps {
    nextStep: () => void;
    setTrackData: ({ title, artist }:{ title: string, artist: string }) => void,
}

export const UploadTrack: React.FC<UploadTrackProps> = ({
    nextStep,
    setTrackData
}) => {
    const form = useForm<z.infer<typeof trackSchema>>({
        resolver: zodResolver(trackSchema),
        defaultValues: {
            artist: '',
            title: '',
        }
    });

    const onSubmit = (values: z.infer<typeof trackSchema>) => {
        setTrackData({
            title: values.title,
            artist: values.artist,
        })
        nextStep();
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
            <div className="mt-8 flex justify-between">
              <Button type="submit" className='ml-auto'>
                Next
              </Button>
            </div>
            </form>
        </Form>
    )
}