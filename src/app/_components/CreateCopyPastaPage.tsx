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
import { api } from "~/trpc/react";
import { PlusIcon } from "lucide-react";
import { determineSource, formatDateToHuman } from "~/lib/utils";
import { createCopyPastaForm } from "../../server/form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import { badgeVariants } from "~/components/ui/badge";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import { id } from "date-fns/locale";

export default function CreateCopyPasta() {
  const [tags] = api.tag.list.useSuspenseQuery();
  const createMutation = api.copyPasta.create.useMutation();

  const tagOptions: Option[] = tags.map((tag) => {
    return {
      label: tag.name,
      value: tag.id,
    };
  });

  const form = useForm<z.infer<typeof createCopyPastaForm>>({
    resolver: zodResolver(createCopyPastaForm),
    defaultValues: {
      content: "",
      postedAt: undefined,
      source: "Other",
      sourceUrl: "",
      tags: [],
    },
  });

  const toast = useToast();

  useEffect(() => {
    if (createMutation.isSuccess) {
      redirect("/dashboard/profile");
    }
  }, [createMutation.isSuccess]);

  function onSubmit(values: z.infer<typeof createCopyPastaForm>) {
    toast({
      message: "",
      promiseFn: createMutation.mutateAsync({
        ...values,
        source: determineSource(values.sourceUrl),
      }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    maxSelected={3}
                    hidePlaceholderWhenSelected
                    onMaxSelected={(maxLimit) => {
                      toast({
                        type: "danger",
                        message: `Maximal tag hanya ${maxLimit}`,
                      });
                    }}
                    hideClearAllButton
                    badgeClassName={badgeVariants({ variant: "destructive" })}
                    defaultOptions={tagOptions}
                    placeholder="Kira kira ini template cocok dengan tag..."
                    emptyIndicator={
                      <p className="text-center text-sm text-slate-600 dark:text-gray-400">
                        Yang kamu cari gak ada 😱
                      </p>
                    }
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
              <FormItem className="mb-2 w-full flex-col">
                <FormLabel className="mb-1">Tanggal kejadian</FormLabel>
                <div>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      granularity="day"
                      placeholder={formatDateToHuman(new Date())}
                      displayFormat={{ hour24: "PPP" }}
                      locale={id}
                    />
                  </FormControl>
                </div>
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
        <div className="mt-6 w-full">
          <Button type="submit" className="w-full items-center">
            Tambah <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
