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
import { CircleHelp, PlusIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { formatDateToHuman } from "~/lib/utils";
import { createCopyPastaForm } from "../../server/form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import { id } from "date-fns/locale";

export const sourceEnumHash = new Map([
  [
    "Twitter",
    {
      label: "Twitter (X)",
      value: "Twitter",
      icon: <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />,
    },
  ],
  [
    "Facebook",
    {
      label: "Facebook",
      value: "Facebook",
      icon: <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />,
    },
  ],
  [
    "Other",
    {
      label: "Lainnya",
      value: "Other",
      icon: <CircleHelp className="h-4 w-4" />,
    },
  ],
]);

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

  const sourceEnum = Object.keys(OriginSource).map((og) => {
    return sourceEnumHash.get(og);
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                    badgeClassName={badgeVariants({ variant: "secondary" })}
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
            name="source"
            render={({ field }) => (
              <FormItem className="mb-2 w-full space-y-2">
                <FormLabel>Sumber</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {sourceEnum.map((source) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={source?.value}
                    >
                      <FormControl>
                        <RadioGroupItem value={source!.value} />
                      </FormControl>
                      <FormLabel>
                        <Badge variant={"secondary"}>
                          {source?.icon}
                          <span className="ml-2">{source?.label}</span>
                        </Badge>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
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
