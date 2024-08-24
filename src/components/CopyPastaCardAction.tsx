"use client";

import { Check, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import useToast from "./ui/use-react-hot-toast";
import { useRouter } from "next/navigation";

export interface CopyPastaCardActionProps {
  id: string;
  isApproved: boolean;
}
export default function CopyPastaCardAction({
  id,
  isApproved,
}: CopyPastaCardActionProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const approveMutation = api.dashboard.approveById.useMutation({
    async onSuccess() {
      void utils.dashboard.listDisapprovedCopyPasta.invalidate();
      void utils.dashboard.countCopyPastaAdmin.invalidate();
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

  function handleEdit() {
    return router.push(`/copy-pasta/${id}/edit`);
  }
  return (
    <div className="mt-4 flex w-full justify-between gap-x-2">
      <Button variant={"yellow"} onClick={handleEdit} size={"sm"}>
        Edit
        <Pencil className="ml-2 w-4" />
      </Button>
      <Button
        variant={"green"}
        onClick={handleApprove}
        size={"sm"}
        disabled={isApproved}
      >
        Setuju <Check className="ml-2 w-4" />
      </Button>
    </div>
  );
}
