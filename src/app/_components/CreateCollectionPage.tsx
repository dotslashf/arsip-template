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
import { parseErrorMessages } from "~/lib/constant";
import { createCollectionForm } from "~/server/form/collection";
import SearchBar from "~/components/Collection/SearchBar";
import CardSearchCollection from "~/components/CopyPasta/CardSearchCollection";
import { CardCopyPastaMinimal } from "~/lib/interface";
import { ScrollBar, ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";

export default function CreateCollection() {
  const [searchResults, setSearchResults] = useState<CardCopyPastaMinimal[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [listOfCollections, setListOfCollections] = useState<CardCopyPastaMinimal[]>([]);

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
    form.setValue("copyPastaIds", listOfCollections.map(copy => copy.id));
  }, [listOfCollections, form]);

  function onSubmit(values: z.infer<typeof createCollectionForm>) {
    // try {
    console.log({
      ...values,
    });
    // await toast({
    //   message: "",
    //   type: "promise",
    //   promiseFn: createMutation.mutateAsync({
    //     ...values,
    //     copyPastaIds
    //   }),
    //   promiseMsg: {
    //     loading: "Sedang memasak 🔥",
    //     success: "Makasih! Koleksimu sudah dibuat ya 😎",
    //     // eslint-disable-next-line
    //     error: (err) => `${parseErrorMessages(err)}`,
    //   },
    // });
    // } catch (error) { }
  }


  const handleAddToCollection = (copyPasta: CardCopyPastaMinimal) => {
    const exists = listOfCollections.some(item => item.id === copyPasta.id);
    if (exists) {
      return toast({
        type: "danger",
        message: "Ups sudah ada dalam koleksi"
      });
    }

    setListOfCollections([...listOfCollections, copyPasta]);
  };

  const handleRemoveFromCollection = (copyPasta: CardCopyPastaMinimal) => {
    setListOfCollections(listOfCollections.filter(item => item.id !== copyPasta.id));
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
          <SearchBar onSearchResults={setSearchResults} onLoadingState={setIsSearching} />
          {isSearching && <LoaderCircle className="w-4 animate-spin mb-4" />}
          {searchResults.length > 0 && (
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex space-x-2 p-2 bg-secondary">
                {searchResults.map(copy => {
                  return (
                    <CardSearchCollection type="add" key={copy.id} copyPasta={copy} onAddToCollection={handleAddToCollection} onRemoveFromCollection={handleRemoveFromCollection} />
                  )
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
            <div className="w-full flex flex-col space-y-2">
              {listOfCollections.map((copy, index) => (
                <div key={copy.id} className="flex w-full">
                  <div className="flex flex-col items-center mr-4">
                    <Circle className="w-4 h-4 text-secondary-foreground" />
                    {index < listOfCollections.length - 1 && (
                      <div className="bg-secondary-foreground w-px h-full mt-2" />
                    )}
                  </div>
                  <CardSearchCollection type="remove" copyPasta={copy} onAddToCollection={handleAddToCollection} onRemoveFromCollection={handleRemoveFromCollection} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex text-sm bg-secondary h-32 w-full rounded-md border-dashed border items-center justify-center">
              <span>Masih kosong nih 😢</span>
            </div>
          )}
        </div>
        <div className="mt-6 w-full">
          <Button
            type="submit"
            className="w-full items-center"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Membuat Koleksi..." : "Tambah Koleksi"}
            <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
