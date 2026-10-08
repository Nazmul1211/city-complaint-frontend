"use client";

import { Camera, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useUploadProfileImage } from "@/hooks";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  name: string;
  role?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload({
  currentAvatarUrl,
  name,
  role = "CITIZEN",
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { mutate: uploadImage, isPending } = useUploadProfileImage();

  const getInitials = (userName: string) => {
    if (!userName) return "C";
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleFileProcess = (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.add({
        title: "Unsupported Image",
        description: "Please upload a JPEG, PNG, or WebP image.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.add({
        title: "File Too Large",
        description: "Image size must not exceed 5MB.",
      });
      return;
    }

    // Set instant local preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    // Prepare multipart form-data
    const formData = new FormData();
    formData.append("profileImage", file);

    uploadImage(formData, {
      onError: () => {
        // Revert local preview on upload failure
        setLocalPreview(null);
      },
    });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const displayAvatar = localPreview || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Avatar Container with Upload Zone */}
      <section
        aria-label="Profile photo upload drop zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`group relative flex size-32 items-center justify-center rounded-full border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/10 ring-4 ring-primary/20 scale-105"
            : "border-border/80 hover:border-primary/60 bg-muted/30"
        }`}
      >
        {displayAvatar ? (
          <Image
            src={displayAvatar}
            alt={name || "Citizen Avatar"}
            width={128}
            height={128}
            unoptimized
            className="size-full rounded-full object-cover shadow-inner"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
            <span className="font-heading text-3xl font-bold tracking-tight">
              {getInitials(name)}
            </span>
          </div>
        )}

        {/* Hover / Drag Overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Upload profile photo"
        >
          {isPending ? (
            <Loader2 className="size-6 animate-spin text-white" />
          ) : (
            <>
              <Camera className="size-6 text-white mb-1" />
              <span className="text-[11px] font-medium tracking-tight">
                Change Photo
              </span>
            </>
          )}
        </button>

        {/* Status Loading Spinner Badge */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1 text-white">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-[10px] font-medium tracking-wide">
                Uploading...
              </span>
            </div>
          </div>
        )}

        {/* Camera Quick Button Badge */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Upload new profile photo"
          aria-label="Upload new profile photo"
        >
          <Camera className="size-4" />
        </button>
      </section>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        onChange={onInputChange}
        className="hidden"
        disabled={isPending}
      />

      {/* Profile Name & Role Info */}
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {name || "Citizen User"}
        </h3>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {role}
        </div>
      </div>

      {/* Quick Action Button & Constraints */}
      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="gap-1.5 text-xs h-8"
        >
          <UploadCloud className="size-3.5" />
          {isPending ? "Uploading..." : "Upload New Photo"}
        </Button>
        <p className="text-[11px] text-muted-foreground max-w-[220px]">
          JPG, PNG or WebP up to 5MB. Drag & drop directly onto photo to change.
        </p>
      </div>
    </div>
  );
}
