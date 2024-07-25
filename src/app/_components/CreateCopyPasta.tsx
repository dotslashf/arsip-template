"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { OriginSource } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";

const formSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Minimal 10 karakter",
    })
    .max(500, {
      message: "Max 500 karakter",
    }),
  postedAt: z.date(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  source: z.nativeEnum(OriginSource),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Pilih 1 tag",
  }),
});

export default function CreateCopyPasta() {
  const [tags] = api.tag.list.useSuspenseQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      postedAt: new Date(),
      source: "Other",
      sourceUrl: "",
      tags: [],
    },
  });

  const sourceEnum = Object.keys(OriginSource);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                <Textarea
                  placeholder="Isi dari templatenya..."
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postedAt"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-col">
              <FormLabel className="mb-1">Tanggal kejadian</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-2">
              <FormLabel>Sumber</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {sourceEnum.map((source) => (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={source}
                  >
                    <FormControl>
                      <RadioGroupItem value={source} />
                    </FormControl>
                    <FormLabel>{source}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="mb-2">
              <div>
                <FormLabel>Tags</FormLabel>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, tag.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== tag.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tag.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6">
          <Button type="submit">Tambah</Button>
        </div>
      </form>
    </Form>
  );
}
