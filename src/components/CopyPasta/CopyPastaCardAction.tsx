"use client";

import { Check, Pencil, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import useToast from "~/components/ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession } from "~/components/Common/SessionContext";

type CopyPastaCardActionProps = {
  id: string;
  isApproved: boolean;
  isDeleted: boolean;
};

export default function CopyPastaCardAction({
  id,
  isApproved,
  isDeleted,
}: CopyPastaCardActionProps) {
  const session = useSession();

  const utils = api.useUtils();
  const router = useRouter();
  const [isSureDelete, setIsSureDelete] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const approveMutation = api.dashboard.approveById.useMutation({
    async onSuccess() {
      void utils.dashboard.listWaitingApprovedCopyPasta.invalidate();
      void utils.dashboard.countCopyPastaAdmin.invalidate();
      void utils.dashboard.listApprovedByUserId.invalidate();
    },
  });
  const deleteMutation = api.dashboard.deleteById.useMutation({
    onSuccess() {
      void utils.dashboard.listWaitingApprovedCopyPasta.invalidate();
      void utils.dashboard.countCopyPastaAdmin.invalidate();
      void utils.dashboard.listApprovedByUserId.invalidate();
      setIsSureDelete(false);
    },
  });

  const toast = useToast();

  async function handleApprove() {
    void toast({
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
    void toast({
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        deleteButtonRef.current &&
        !deleteButtonRef.current.contains(event.target as Node)
      ) {
        setIsSureDelete(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteButtonRef]);

  return (
    <div className="flex w-full justify-between gap-x-2">
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
        {session?.user.role === "SuperAdmin" && (
          <>
            {isSureDelete ? (
              <Button
                ref={deleteButtonRef}
                variant={"destructive"}
                onClick={handleDelete}
                size={"sm"}
              >
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
          </>
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
