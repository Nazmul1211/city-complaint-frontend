"use client";

import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MediaAttachment } from "@/types";

interface AttachmentGalleryProps {
  attachments: MediaAttachment[];
}

export function AttachmentGallery({ attachments }: AttachmentGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
        <ImageIcon className="size-8 text-muted-foreground" />
        <p className="mt-2 text-xs font-semibold text-foreground">
          No photographic evidence attached
        </p>
        <p className="text-[11px] text-muted-foreground">
          No on-site photos were uploaded during ticket submission.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {attachments.map((item, idx) => {
          const isPdf =
            item.mimeType === "application/pdf" || item.url.endsWith(".pdf");

          return (
            <div
              key={item.id || idx}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-xs transition-colors hover:border-primary/40"
            >
              {isPdf ? (
                <div className="flex h-32 flex-col items-center justify-center bg-muted/30 p-4 text-center">
                  <FileText className="size-8 text-primary" />
                  <span className="mt-2 truncate font-medium text-foreground max-w-[120px]">
                    PDF Document
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedImage(item.url)}
                  className="relative h-32 w-full cursor-pointer bg-muted/40 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View full preview of ${item.caption || "attachment"}`}
                >
                  {/* biome-ignore lint/performance/noImgElement: dynamic user uploaded complaint attachments */}
                  <img
                    src={item.url}
                    alt={item.caption || "Inspection attachment"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="size-5 text-white" />
                  </div>
                </button>
              )}

              <div className="flex items-center justify-between p-2 border-t bg-card">
                <span className="truncate text-[11px] text-muted-foreground">
                  {item.caption || `Evidence #${idx + 1}`}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-view Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="max-w-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Inspection Photo Evidence
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="mt-2 flex max-h-[70vh] items-center justify-center overflow-hidden rounded-md bg-black/90">
              {/* biome-ignore lint/performance/noImgElement: dynamic modal preview */}
              <img
                src={selectedImage}
                alt="Full preview"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
