"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
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
import { CalendarIcon, CircleHelp, PlusIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { cn, formatDateToHuman } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { createCopyPastaForm } from "../form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const sourceEnumHash = new Map([
  [
    "Twitter",
    {
      label: "Twitter (X)",
      value: "Twitter",
      icon: <FontAwesomeIcon icon={faTwitter} className="h-3 w-3" />,
    },
  ],
  [
    "Facebook",
    {
      label: "Facebook",
      value: "Facebook",
      icon: <FontAwesomeIcon icon={faFacebook} className="h-3 w-3" />,
    },
  ],
  [
    "Other",
    {
      label: "Lainnya",
      value: "Other",
      icon: <CircleHelp className="h-3 w-3" />,
    },
  ],
]);

export default function CreateCopyPasta() {
  const [tags] = api.tag.list.useSuspenseQuery();
  const createMutation = api.copyPasta.create.useMutation();

  const form = useForm<z.infer<typeof createCopyPastaForm>>({
    resolver: zodResolver(createCopyPastaForm),
    defaultValues: {
      content: "",
      postedAt: new Date(),
      source: "Other",
      sourceUrl: "",
      tags: [],
    },
  });

  const sourceEnum = Object.keys(OriginSource).map((og) => {
    return sourceEnumHash.get(og);
  });

  const toast = useToast();

  useEffect(() => {
    if (createMutation.isSuccess) {
      redirect("/");
    }
  }, [createMutation.isSuccess]);

  function onSubmit(values: z.infer<typeof createCopyPastaForm>) {
    toast({
      message: "",
      promiseFn: createMutation.mutateAsync({ ...values }),
      type: "promise",
      promiseMsg: {
        success: "Makasih!, tunggu diapproved ya!",
        loading: "🔥 Sedang memasak",
        error: "Duh, gagal nih",
      },
    });
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

        <div className="flex justify-between gap-x-2">
          <FormField
            control={form.control}
            name="postedAt"
            render={({ field }) => (
              <FormItem className="mb-2 w-full flex-col">
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
                          formatDateToHuman(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
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
              <FormItem className="mb-2 w-full">
                <FormLabel>Doksli</FormLabel>
                <FormControl>
                  <Input placeholder="www.doksli.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-2">
              <FormLabel>Sumber</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-3"
              >
                {sourceEnum.map((source) => (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={source?.value}
                  >
                    <FormControl>
                      <RadioGroupItem value={source!.value} />
                    </FormControl>
                    <FormLabel className="flex items-center gap-x-2">
                      {source?.icon}
                      {source?.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({}) => (
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
        <div className="mt-6 w-full">
          <Button type="submit" className="w-full items-center">
            Tambah <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
