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
import { Circle, LoaderCircle, PlusIcon } from "lucide-react";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FORM_COLLECTION_CONSTANT, parseErrorMessages } from "~/lib/constant";
import { createCollectionForm } from "~/server/form/collection";
import SearchBar from "~/components/Collection/SearchBar";
import CardSearchCollection from "~/components/CopyPasta/CardSearchCollection";
import { type CardCopyPastaMinimal } from "~/lib/interface";
import { ScrollBar, ScrollArea } from "~/components/ui/scroll-area";
import EmptyState from "~/components/EmptyState";

export default function CreateCollection() {
  const [searchResults, setSearchResults] = useState<CardCopyPastaMinimal[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [listOfCollections, setListOfCollections] = useState<
    CardCopyPastaMinimal[]
  >([]);

  const createMutation = api.collection.create.useMutation();

  const router = useRouter();

  const form = useForm<z.infer<typeof createCollectionForm>>({
    resolver: zodResolver(createCollectionForm),
    defaultValues: {
      name: "",
      description: "",
      copyPastaIds: [],
    },
  });

  const toast = useToast();

  useEffect(() => {
    if (createMutation.isSuccess) {
      return router.push("/dashboard/profile?utm_content=create_collection");
    }
  }, [createMutation.isSuccess, router]);

  useEffect(() => {
    form.setValue(
      "copyPastaIds",
      listOfCollections.map((copy) => copy.id),
    );
  }, [listOfCollections, form, toast]);

  async function onSubmit(values: z.infer<typeof createCollectionForm>) {
    try {
      await toast({
        message: "",
        type: "promise",
        promiseFn: createMutation.mutateAsync({
          ...values,
        }),
        promiseMsg: {
          loading: "Sedang memasak 🔥",
          success: "Makasih! Koleksimu sudah dibuat ya 😎",
          // eslint-disable-next-line
          error: (err) => `${parseErrorMessages(err)}`,
        },
      });
    } catch (error) {}
  }

  const handleAddToCollection = (copyPasta: CardCopyPastaMinimal) => {
    if (listOfCollections.length >= FORM_COLLECTION_CONSTANT.copyPastaIds.max) {
      return toast({
        type: "danger",
        message: "Sudah mencapai batas nih!",
      });
    }

    const exists = listOfCollections.some((item) => item.id === copyPasta.id);
    if (exists) {
      return toast({
        type: "danger",
        message: "Ups sudah ada dalam koleksi",
      });
    }

    setListOfCollections([...listOfCollections, copyPasta]);
  };

  const handleRemoveFromCollection = (copyPasta: CardCopyPastaMinimal) => {
    setListOfCollections(
      listOfCollections.filter((item) => item.id !== copyPasta.id),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Judul Koleksi</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Judul koleksi..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi tentang koleksi template ini..."
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SearchBar
            onSearchResults={setSearchResults}
            onLoadingState={setIsSearching}
          />
          {isSearching && <LoaderCircle className="mb-4 w-4 animate-spin" />}
          {searchResults.length > 0 && (
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex space-x-2 bg-secondary p-2">
                {searchResults.map((copy) => {
                  return (
                    <CardSearchCollection
                      type="add"
                      key={copy.id}
                      copyPasta={copy}
                      onAddToCollection={handleAddToCollection}
                      onRemoveFromCollection={handleRemoveFromCollection}
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
          <FormField
            control={form.control}
            name="copyPastaIds"
            render={() => (
              <FormItem>
                <FormLabel>List Template</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {listOfCollections.length > 0 ? (
            <div className="flex w-full flex-col space-y-2">
              {listOfCollections.map((copy, index) => (
                <div key={copy.id} className="flex w-full">
                  <div className="mr-4 flex flex-col items-center">
                    <Circle className="h-4 w-4 text-secondary-foreground" />
                    {index < listOfCollections.length - 1 && (
                      <div className="mt-2 h-full w-px bg-secondary-foreground" />
                    )}
                  </div>
                  <CardSearchCollection
                    type="remove"
                    copyPasta={copy}
                    onAddToCollection={handleAddToCollection}
                    onRemoveFromCollection={handleRemoveFromCollection}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Masih kosong nih 😢" />
          )}
        </div>
        <div className="mt-6 w-full">
          <Button
            type="submit"
            className="w-full items-center"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Membuat Koleksi..."
              : "Tambah Koleksi"}
            <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
