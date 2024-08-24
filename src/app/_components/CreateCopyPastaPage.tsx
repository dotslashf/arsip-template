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
import {
  ACCEPTED_IMAGE_TYPES,
  createCopyPastaFormClient,
  MAX_FILE_SIZE,
} from "../../server/form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import { badgeVariants } from "~/components/ui/badge";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import { id } from "date-fns/locale";

export default function CreateCopyPasta() {
  const [tags] = api.tag.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
    refetchOnMount: false,
    gcTime: 7 * DAYS,
  });
  const createMutation = api.copyPasta.create.useMutation();
  const getUploadUrl = api.upload.getUploadSignedUrl.useMutation();

  const tagOptions: Option[] = tags.map((tag) => {
    return {
      label: tag.name,
      value: tag.id,
    };
  });

  const form = useForm<z.infer<typeof createCopyPastaFormClient>>({
    resolver: zodResolver(createCopyPastaFormClient),
    defaultValues: {
      content: "",
      postedAt: undefined,
      source: "Other",
      sourceUrl: "",
      tags: [],
      imageUrl: null,
    },
  });

  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (createMutation.isSuccess) {
      redirect("/dashboard/profile");
    }
  }, [createMutation.isSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      ACCEPTED_IMAGE_TYPES.includes(selectedFile.type) &&
      selectedFile.size <= MAX_FILE_SIZE
    ) {
      setFile(selectedFile);
      form.setValue("imageUrl", selectedFile);
    } else {
      toast({
        message: "Hanya boleh gambar dan berukuran <= 2MB 🤓",
        type: "danger",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof createCopyPastaFormClient>) {
    try {
      if (!file) {
        toast({
          type: "promise",
          message: "",
          promiseFn: createMutation.mutateAsync({
            ...values,
            source: determineSource(values.sourceUrl),
          }),
          promiseMsg: {
            error: "Duh, gagal nih 😢",
            loading: "Sedang memasak 🔥",
            success: "Makasih! Tunggu diapproved ya 😎",
          },
        });
        return;
      }

      const url = await getUploadUrl.mutateAsync({
        contentType: file.type,
        fileName: file.name,
      });

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      toast({
        type: "promise",
        message: "",
        promiseFn: createMutation.mutateAsync({
          ...values,
          source: determineSource(values.sourceUrl),
          imageUrl: url.split("?")[0],
        }),
        promiseMsg: {
          error: "Duh, gagal nih 😢",
          loading: "Sedang memasak 🔥",
          success: "Makasih! Tunggu diapproved ya 😎",
        },
      });
    } catch (error) {
      toast({
        type: "danger",
        message: "Duh, gagal nih",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="">
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
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full flex-col">
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
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Doksli</FormLabel>
                  <FormControl>
                    <Input placeholder="www.doksli.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gambar Doksli</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      value={field.value ? field.value[0] : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
