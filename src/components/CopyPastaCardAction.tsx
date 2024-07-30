"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import useToast from "./ui/use-react-hot-toast";

interface CopyPastaCardActionProps {
  id: string;
}
export default function CopyPastaCardAction({ id }: CopyPastaCardActionProps) {
  const utils = api.useUtils();
  const approveMutation = api.profile.approveById.useMutation({
    async onSuccess() {
      void utils.profile.listDisapprovedCopyPasta.invalidate();
    },
  });

  const toast = useToast();

  async function handleApprove() {
    toast({
      message: "",
      promiseFn: approveMutation.mutateAsync({
        id,
      }),
      type: "promise",
      promiseMsg: {
        success: "Template sudah terapprove!",
        loading: "🔥 Sedang memasak",
        error: "Duh, gagal nih",
      },
    });
  }
  return (
    <Button
      className="bg-green-500 text-white hover:bg-green-600"
      onClick={handleApprove}
      size={"icon"}
    >
      <Check className="w-4" />
    </Button>
  );
}
