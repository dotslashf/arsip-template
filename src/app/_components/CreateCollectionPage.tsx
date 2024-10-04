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
import { LoaderCircle, PlusIcon } from "lucide-react";
import { type z } from "zod";
import useToast from "~/components/ui/use-react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FORM_COLLECTION_CONSTANT, parseErrorMessages } from "~/lib/constant";
import { createCollectionForm } from "~/server/form/collection";
import SearchBar from "~/components/Collection/SearchBar";
import CardSearchResult from "~/components/Collection/CardSearchResult";
import { type CopyPastaSearchResult } from "~/lib/interface";
import { ScrollBar, ScrollArea } from "~/components/ui/scroll-area";
import EmptyState from "~/components/Common/EmptyState";
import CardList from "~/components/Collection/CardLists";
import BreadCrumbs from "~/components/Common/BreadCrumbs";
import { getBreadcrumbs } from "~/utils";

export default function CreateCollection() {
  const createMutation = api.collection.create.useMutation();

  const [searchResults, setSearchResults] = useState<CopyPastaSearchResult[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [listOfCollections, setListOfCollections] = useState<
    CopyPastaSearchResult[]
  >([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchAreaRef = useRef<HTMLDivElement>(null);

  const toast = useToast();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const router = useRouter();

  const form = useForm<z.infer<typeof createCollectionForm>>({
    resolver: zodResolver(createCollectionForm),
    defaultValues: {
      name: "",
      description: "",
      copyPastaIds: [],
    },
  });

  const handleAddToCollection = (copyPasta: CopyPastaSearchResult) => {
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

    void toast({
      type: "success",
      message: "Ditambahkan dalam koleksi 😉",
    });

    setListOfCollections([...listOfCollections, copyPasta]);
  };

  const handleRemoveFromCollection = (copyPasta: CopyPastaSearchResult) => {
    setListOfCollections(
      listOfCollections.filter((item) => item.id !== copyPasta.id),
    );
  };

  const renderCollection = (copy: CopyPastaSearchResult) => (
    <CardSearchResult
      type="remove"
      copyPasta={copy}
      onAddToCollection={handleAddToCollection}
      onRemoveFromCollection={handleRemoveFromCollection}
    />
  );

  const handleSearchBlur = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchResults = (results: CopyPastaSearchResult[]) => {
    setSearchResults(results);
    setShowResults(true);
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target as Node)
      ) {
        handleSearchBlur();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleSearchBlur]);

  useEffect(() => {
    if (createMutation.isSuccess) {
      return router.push("/dashboard/collection?utm_content=create_collection");
    }
  }, [createMutation.isSuccess, router]);

  useEffect(() => {
    form.setValue(
      "copyPastaIds",
      listOfCollections.map((copy) => copy.id as string),
    );
  }, [listOfCollections, form]);

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

  return (
    <div className="flex w-full flex-col">
      <BreadCrumbs path={breadcrumbs} />
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
                      placeholder="Koleksi arsip..."
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
            <div
              className="flex flex-col gap-4"
              ref={searchAreaRef}
              onFocus={handleSearchFocus}
            >
              <SearchBar
                onSearchResults={handleSearchResults}
                onLoadingState={setIsSearching}
              />
              {isSearching && (
                <div className="flex h-20 items-center justify-center rounded-md border bg-secondary">
                  <LoaderCircle className="w-4 animate-spin" />
                </div>
              )}
              {!isSearching && showResults && searchResults.length > 0 && (
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex w-full space-x-2 bg-secondary p-2">
                    {searchResults.map((copy) => {
                      return (
                        <div key={copy.id} className="w-80">
                          <CardSearchResult
                            type="add"
                            copyPasta={copy}
                            onAddToCollection={handleAddToCollection}
                            onRemoveFromCollection={handleRemoveFromCollection}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </div>
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
              <div className="flex w-full flex-col">
                <CardList
                  listOfCollections={listOfCollections}
                  renderCollection={renderCollection}
                />
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
              {form.formState.isSubmitting ? (
                <>
                  Membuat Koleksi...
                  <LoaderCircle className="ml-2 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Tambah Koleksi
                  <PlusIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
