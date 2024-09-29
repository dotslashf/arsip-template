"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { LoaderCircle, PlusIcon } from "lucide-react";
import {
  determineSource,
  formatDateToHuman,
  getBreadcrumbs,
  getTweetId,
} from "~/lib/utils";
import { createCopyPastaFormClient } from "../../server/form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import { badgeVariants } from "~/components/ui/badge";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import { id } from "date-fns/locale";
import { DAYS, parseErrorMessages } from "~/lib/constant";
import BreadCrumbs from "~/components/BreadCrumbs";
import Link from "next/link";
import { Tweet } from "react-tweet";
import { type Tweet as TweetInterface } from "react-tweet/api";
import { parseISO } from "date-fns";
import { useToBlob } from "@hugocxl/react-to-image";
import he from "he";

export default function CreateCopyPasta() {
  const [tags] = api.tag.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
    refetchOnMount: false,
    gcTime: 7 * DAYS,
  });
  const createMutation = api.copyPasta.create.useMutation();
  const updateStreakMutation = api.user.updateUserStreak.useMutation();
  const validateCopyPastaMutation =
    api.copyPasta.validateCopyPastaContent.useMutation();
  const getUploadUrl = api.upload.getUploadSignedUrl.useMutation();

  const router = useRouter();

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
  const [modeCreate, setModeCreate] = useState<"manual" | "auto">("manual");

  useEffect(() => {
    if (createMutation.isSuccess) {
      return router.push("/dashboard/profile?utm_content=create_copy_pasta");
    }
  }, [createMutation.isSuccess, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      form.setValue("imageUrl", selectedFile);
    }
  };

  async function onSubmit(values: z.infer<typeof createCopyPastaFormClient>) {
    try {
      if (
        modeCreate === "auto" &&
        determineSource(values.sourceUrl) !== "Twitter"
      ) {
        return form.setError("sourceUrl", {
          message: "Hanya support link twitter 😉",
        });
      }

      try {
        await validateCopyPastaMutation.mutateAsync({
          content: values.content,
        });
      } catch (error) {
        return toast({
          type: "danger",
          message: parseErrorMessages(error as Record<string, any>),
        });
      }

      if (!file) {
        await toast({
          message: "",
          type: "promise",
          promiseFn: Promise.all([
            await createMutation.mutateAsync({
              ...values,
              source: determineSource(values.sourceUrl),
            }),
            await updateStreakMutation.mutateAsync(),
          ]),
          promiseMsg: {
            loading: "Sedang memasak 🔥",
            success: "Makasih! Tunggu diapproved ya 😎",
            // eslint-disable-next-line
            error: (err) => `${parseErrorMessages(err)}`,
          },
        });
        return;
      }

      const url = await getUploadUrl.mutateAsync({
        contentType: file.type,
        fileName: file.name,
      });

      await toast({
        type: "promise",
        message: "",
        promiseFn: fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        }),
        promiseMsg: {
          loading: "Sedang memasak 🔥",
          success: "Image berhasil diupload 📸",
          // eslint-disable-next-line
          error: (err) => `${parseErrorMessages(err)}`,
        },
      });

      await toast({
        message: "",
        type: "promise",
        promiseFn: Promise.all([
          createMutation.mutateAsync({
            ...values,
            source: determineSource(values.sourceUrl),
            imageUrl: url.split("?")[0],
          }),
          updateStreakMutation.mutateAsync(),
        ]),
        promiseMsg: {
          loading: "Sedang memasak 🔥",
          success: "Makasih! Tunggu diapproved ya 😎",
          // eslint-disable-next-line
          error: (err) => `${parseErrorMessages(err)}`,
        },
      });
    } catch (error) {}
  }

  const [fetchedTweetId, setFetchedTweetId] = useState<string | null>();

  async function fetchTweetData() {
    if (determineSource(form.getValues("sourceUrl")) !== "Twitter") {
      return form.setError("sourceUrl", {
        message: "Hanya support link twitter 😉",
      });
    } else {
      form.clearErrors();
    }

    const tweetId = getTweetId(form.getValues("sourceUrl") ?? "");
    if (!tweetId) return null;
    setFetchedTweetId(tweetId);
    const url = `https://react-tweet.vercel.app/api/tweet/${tweetId}`;

    try {
      const response = await fetch(url, {});
      const { data } = (await response.json()) as { data: TweetInterface };

      form.setValue("content", he.decode(data.text));
      form.setValue("postedAt", parseISO(data.created_at));
    } catch (error) {
      console.error("Error fetching tweet data:", error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, convert, ref] = useToBlob<HTMLDivElement>({
    onSuccess: async (data) => {
      if (!data) return null;
      const file = new File([data], "tweet.png", { type: "image/png" });
      setFile(file);
      form.setValue("imageUrl", file);
    },
    onError: (error) => console.log("Error", error),
  });

  useEffect(() => {
    if (fetchedTweetId) {
      const timeoutId = setTimeout(() => {
        convert();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedTweetId]);

  useEffect(() => {
    setFile(null);
    setFetchedTweetId(null);
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeCreate]);

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex w-full flex-col">
      <BreadCrumbs path={breadcrumbs} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 gap-4">
            <Select
              onValueChange={(value) =>
                setModeCreate(value as "manual" | "auto")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mode Buat" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mode Buat</SelectLabel>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="auto">Automatis</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {modeCreate === "manual" ? (
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
                    <FormDescription className="font-semibold">
                      Pastikan mengecek templatenya sudah ada atau belum yah! 😎
                      <br />
                      Bisa menggunakan fitur{" "}
                      <Link
                        href={"/copy-pasta"}
                        className="text-primary underline"
                        prefetch={false}
                        target="__blank"
                      >
                        cari disini
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tweet original</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://x.com/ichikiwhere/status/1827573537336652224"
                        {...field}
                        type="url"
                        required={modeCreate === "auto"}
                        onBlur={fetchTweetData}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Saat ini hanya untuk twitter 😉
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
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
                        void toast({
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
            {modeCreate === "manual" && (
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
                          locale={id}
                          displayFormat={{ hour24: "PPP" }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {modeCreate === "manual" && (
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                <FormField
                  control={form.control}
                  name="sourceUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Doksli</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="www.doksli.com"
                          {...field}
                          type="url"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Gambar</FormLabel>
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
            )}
            {fetchedTweetId && (
              <div
                ref={ref}
                className="flex items-center justify-center bg-background"
              >
                <Tweet id={fetchedTweetId} />
              </div>
            )}
          </div>
          <div className="mt-6 w-full">
            <Button
              type="submit"
              className="w-full items-center"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  Mengarsipkan...
                  <LoaderCircle className="ml-2 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Arsipkan <PlusIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
