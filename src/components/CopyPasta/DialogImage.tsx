import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { trimContent } from "~/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const calculateReducedDimensions = (
    originalWidth: number,
    originalHeight: number,
    maxWidth = 960,
  ) => {
    if (originalWidth <= maxWidth) {
      return { width: originalWidth, height: originalHeight };
    }
    const aspectRatio = originalWidth / originalHeight;
    const reducedWidth = maxWidth;
    const reducedHeight = Math.round(maxWidth / aspectRatio);
    return { width: reducedWidth, height: reducedHeight };
  };

  const reducedDimensions = calculateReducedDimensions(
    imageDimensions.width,
    imageDimensions.height,
  );

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm">
          <ImageIcon className="mr-2 h-4 w-4" />
          Gambar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[90vw] overflow-hidden rounded-md md:w-auto md:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>{trimContent(content, 50)}</DialogDescription>
        </DialogHeader>
        <div className="relative h-full w-full overflow-auto">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={imageUrl}
              alt="Gambar screenshot"
              width={reducedDimensions.width}
              height={reducedDimensions.height}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(90vh - 100px)",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
