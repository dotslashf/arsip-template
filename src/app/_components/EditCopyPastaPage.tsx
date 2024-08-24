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
import { Pencil } from "lucide-react";
import { determineSource, formatDateToHuman } from "~/lib/utils";
import { editCopyPastaForm } from "../../server/form/copyPasta";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import { badgeVariants } from "~/components/ui/badge";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import { id as idLocale } from "date-fns/locale";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface EditCopyPastaProps {
  id: string;
}
export default function EditCopyPasta({ id }: EditCopyPastaProps) {
  const [tags] = api.tag.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
    refetchOnMount: false,
    gcTime: 7 * DAYS,
  });
  const [copyPasta] = api.dashboard.byId.useSuspenseQuery({
    id,
  });

  const utils = api.useUtils();
  const editMutation = api.dashboard.editCopyPasta.useMutation({
    async onSuccess() {
      void utils.dashboard.listWaitingApprovedCopyPasta.invalidate();
      void utils.dashboard.countCopyPastaAdmin.invalidate();
    },
  });

  const tagOptions: Option[] = tags.map((tag) => {
    return {
      label: tag.name,
      value: tag.id,
    };
  });

  const form = useForm<z.infer<typeof editCopyPastaForm>>({
    resolver: zodResolver(editCopyPastaForm),
    defaultValues: {
      id: copyPasta.id,
      content: copyPasta.content,
      postedAt: copyPasta.postedAt,
      source: copyPasta.source,
      sourceUrl: copyPasta.sourceUrl ?? undefined,
      tags: copyPasta.CopyPastasOnTags.map((tag) => {
        return {
          label: tag.tags.name,
          value: tag.tags.id,
        };
      }),
    },
  });

  const toast = useToast();

  useEffect(() => {
    if (editMutation.isSuccess) {
      redirect(`/dashboard/profile`);
    }
  }, [editMutation.isSuccess, id]);

  function onSubmit(values: z.infer<typeof editCopyPastaForm>) {
    toast({
      message: "",
      promiseFn: editMutation.mutateAsync({
        ...values,
        source: determineSource(values.sourceUrl),
      }),
      type: "promise",
      promiseMsg: {
        success: "Template sudah diedit dan diapprove!",
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
                  disabled
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
                      locale={idLocale}
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
          <Button
            type="submit"
            className="w-full items-center"
            variant={"yellow"}
          >
            Edit <Pencil className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
