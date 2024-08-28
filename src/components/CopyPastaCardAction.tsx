"use client";

import { Check, Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import useToast from "./ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface CopyPastaCardActionProps {
  id: string;
  isApproved: boolean;
  isDeleted: boolean;
}
export default function CopyPastaCardAction({
  id,
  isApproved,
  isDeleted,
}: CopyPastaCardActionProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const [isSureDelete, setIsSureDelete] = useState(false);
  const approveMutation = api.dashboard.approveById.useMutation({
    async onSuccess() {
      void utils.dashboard.listWaitingApprovedCopyPasta.invalidate();
      void utils.dashboard.countCopyPastaAdmin.invalidate();
    },
  });
  const deleteMutation = api.dashboard.deleteById.useMutation({
    onSuccess() {
      void utils.dashboard.listWaitingApprovedCopyPasta.invalidate();
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

  async function handleDelete() {
    toast({
      message: "",
      type: "promise",
      promiseFn: deleteMutation.mutateAsync({
        id,
      }),
      promiseMsg: {
        success: "Template sudah dihapus! 🗑️",
        loading: "🔥 Sedang memasak",
        error: "Duh, gagal nih",
      },
    });
  }
  return (
    <div className="mt-4 flex w-full justify-between gap-x-2">
      <div className="flex space-x-2">
        <Button
          variant={"warning"}
          onClick={handleEdit}
          size={"sm"}
          disabled={isDeleted}
        >
          Edit
          <Pencil className="ml-2 w-4" />
        </Button>
        {isSureDelete ? (
          <Button variant={"destructive"} onClick={handleDelete} size={"sm"}>
            Yakin
            <Check className="ml-2 w-4" />
          </Button>
        ) : (
          <Button
            variant={"destructive"}
            onClick={() => setIsSureDelete(true)}
            size={"sm"}
            disabled={isDeleted}
          >
            Hapus
            <Trash className="ml-2 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant={"confirm"}
        onClick={handleApprove}
        size={"sm"}
        disabled={isApproved}
        className="hover:bg-green-900"
      >
        Setuju <Check className="ml-2 w-4" />
      </Button>
    </div>
  );
}
