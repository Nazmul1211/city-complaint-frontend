"use client";

import { Camera, Eye, EyeOff, Send, Upload, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useAddWorkUpdate, useUploadAttachment } from "@/hooks";

interface WorkUpdateFormProps {
  requestId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function WorkUpdateForm({
  requestId,
  onSuccess,
  onCancel,
  className = "",
}: WorkUpdateFormProps) {
  const [note, setNote] = useState<string>("");
  const [visibleToCitizen, setVisibleToCitizen] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: postWorkUpdate } = useAddWorkUpdate();
  const { mutateAsync: uploadPhoto } = useUploadAttachment();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, WEBP).",
        type: "error",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.add({
        title: "File Too Large",
        description: "Image size must be less than 10 MB.",
        type: "warning",
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.add({
        title: "Note Required",
        description: "Please describe the progress or inspection findings.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Post work update log
      await postWorkUpdate({
        requestId,
        payload: {
          note: note.trim(),
          visibleToCitizen,
        },
      });

      // 2. Upload onsite photo proof if attached
      if (selectedFile) {
        await uploadPhoto({
          requestId,
          file: selectedFile,
          purpose: "PHOTO",
        });
      }

      toast.add({
        title: "Work Update Logged",
        description: selectedFile
          ? "Progress update and onsite photo proof uploaded successfully."
          : "Casework progress update posted successfully.",
        type: "success",
      });

      // Reset form state
      setNote("");
      handleRemoveFile();
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as Error;
      toast.add({
        title: "Failed to Post Update",
        description:
          error?.message ||
          "Could not save work update. Please verify network and permissions.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 rounded-xl border bg-card p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Camera className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Log Field Casework Update
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Document technician progress notes and attach geotagged photo
              proof.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-[10px]">
          Field Proof
        </Badge>
      </div>

      {/* Progress Description / Note */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="work-update-note"
            className="text-xs font-semibold text-foreground"
          >
            Inspection Report / Actions Taken
          </label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {note.length}/2000
          </span>
        </div>
        <Textarea
          id="work-update-note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 2000))}
          placeholder="Document actions taken, crew arrived on site, repair milestones, or required follow-ups..."
          className="text-xs min-h-[90px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Photo Attachment Section */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-foreground block">
          On-site Photo Proof (Optional)
        </span>

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-lg border bg-muted/30 p-2.5 flex items-center gap-3">
            <div className="relative size-16 shrink-0 rounded-md overflow-hidden border bg-background">
              <Image
                src={previewUrl}
                alt="Selected preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-xs font-medium text-foreground truncate">
                {selectedFile?.name}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {selectedFile && (selectedFile.size / 1024).toFixed(1)} KB •
                Photo Proof
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleRemoveFile}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-destructive"
              title="Remove attached photo"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border border-dashed border-input hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-colors text-center w-full"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Upload className="size-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-primary">
                Click to select photo
              </span>{" "}
              <span className="text-muted-foreground">or drag and drop</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              PNG, JPG, or WEBP up to 10 MB
            </p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Citizen Visibility Toggle */}
      <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
        <div className="flex items-center gap-2">
          <Checkbox
            id="visible-to-citizen"
            checked={visibleToCitizen}
            onCheckedChange={(checked) => setVisibleToCitizen(Boolean(checked))}
            disabled={isSubmitting}
          />
          <label
            htmlFor="visible-to-citizen"
            className="text-xs font-medium text-foreground cursor-pointer select-none"
          >
            Publish update to Citizen Timeline
          </label>
        </div>

        <Badge
          variant={visibleToCitizen ? "info" : "outline"}
          className="gap-1 text-[10px] py-0"
        >
          {visibleToCitizen ? (
            <>
              <Eye className="size-2.5" /> Public
            </>
          ) : (
            <>
              <EyeOff className="size-2.5" /> Staff Only
            </>
          )}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={!note.trim() || isSubmitting}
          className="h-8 text-xs gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-3.5" />
              Publishing Update...
            </>
          ) : (
            <>
              <span>Post Work Update</span>
              <Send className="size-3" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
