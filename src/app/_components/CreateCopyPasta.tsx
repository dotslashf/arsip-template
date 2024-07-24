"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { OriginSource } from "@prisma/client"

const formSchema = z.object({
    content: z.string().min(10, {
        message: "Minimal 10 karakter"
    }).max(500, {
        message: "Max 500 karakter"
    }),
    postedAt: z.date().nullable(),
    sourceUrl: z.string().url().nullish(),
    source: z.nativeEnum(OriginSource),
    tags: z.string().uuid().array().nullable()
});

export default function CreateCopyPasta() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            postedAt: new Date(),
            source: "Other",
            sourceUrl: "",
            tags: []
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Isi dari templatenya..." {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sourceUrl"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Doksli</FormLabel>
                            <FormControl>
                                <Input placeholder="Tautan menuju doksli" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="mt-72">
                    <Button type="submit">Tambah</Button>
                </div>
            </form>
        </Form>
    )
}