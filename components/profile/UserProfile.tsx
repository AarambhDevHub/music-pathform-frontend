import { useForm } from "react-hook-form"
import { z } from "zod"
import { nameUpdateSchema } from "../schema/profileType"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserDataProps } from "./Profile"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export const Userprofile = ({ userData }: { userData: UserDataProps }) => {

    const form = useForm<z.infer<typeof nameUpdateSchema>>({
        resolver: zodResolver(nameUpdateSchema),
        defaultValues: {
            email: userData.email,
            name: userData.username, 
        }
    })

    return (
        <div className="p-4">
            <span className="text-center font-bold">
                User Details
            </span>
            <Form {...form}>
                <form>
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder="john.doe@example.com"
                                            type="email" 
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder="John Doe"
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    )
}