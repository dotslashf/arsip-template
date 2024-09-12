import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { trimContent } from "~/lib/utils";
import Image from "next/image";

interface DialogImageProps {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
  imageUrl: string;
  content: string;
}
export default function DialogImage({
  handleOpen,
  imageUrl,
  content,
  isOpen,
}: DialogImageProps) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size={"sm"} className="text-sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Gambar
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-[300px] rounded-md md:max-w-[450px]"
          aria-describedby="Bukti Gambar"
        >
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              Screenshot template {trimContent(content, 10)}
            </DialogDescription>
          </DialogHeader>
          <Image
            src={imageUrl}
            alt="Gambar screenshot"
            width={0}
            height={0}
            sizes="25vw"
            style={{
              objectFit: "fill",
              width: "100%",
              height: "auto",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
