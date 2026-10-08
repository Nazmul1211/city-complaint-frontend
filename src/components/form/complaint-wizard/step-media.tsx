"use client";

import {
  Camera,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "@/components/ui/toast";

interface StepMediaProps {
  files: File[];
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (index: number) => void;
  reviewData: {
    categoryName: string;
    departmentName: string;
    wardName: string;
    addressLine: string;
    title: string;
    priority: string;
    type: string;
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function StepMedia({
  files,
  onAddFiles,
  onRemoveFile,
  reviewData,
}: StepMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selectedList = Array.from(e.target.files);
    const validFiles: File[] = [];

    for (const f of selectedList) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast.add({
          title: "Unsupported File",
          description: `${f.name} is not a supported file type. Only JPG, PNG, WEBP, and PDF are allowed.`,
          type: "error",
        });
        continue;
      }

      if (f.size > MAX_FILE_SIZE) {
        toast.add({
          title: "File Exceeds Size",
          description: `${f.name} exceeds the 5MB upload limit.`,
          type: "error",
        });
        continue;
      }

      validFiles.push(f);
    }

    if (validFiles.length > 0) {
      onAddFiles(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Step 4: Attach Photographic Evidence & Review
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Attaching clear on-site photos significantly accelerates technician
          dispatch and provides undeniable proof of the issue.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/40 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">
            Click to upload on-site photos or documents
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP, or PDF up to 5MB each (Max 5 files)
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted">
            <Camera className="size-3.5 text-primary" />
            Browse Device Media
          </span>
        </button>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground">
              Attached Files ({files.length})
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-md border bg-card p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="size-4 shrink-0 text-primary" />
                    ) : (
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="truncate">
                      <p className="truncate font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Review Card */}
      <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Submission Summary Review
        </h4>
        <div className="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Issue Category:</span>
            <p className="font-semibold text-foreground">
              {reviewData.categoryName || "Not selected"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Department:</span>
            <p className="font-semibold text-foreground">
              {reviewData.departmentName || "Automated Triage"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Jurisdiction:</span>
            <p className="font-semibold text-foreground">
              {reviewData.wardName || "Ward not specified"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Location Address:</span>
            <p className="font-semibold text-foreground truncate">
              {reviewData.addressLine || "Address not entered"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Complaint Subject:</span>
            <p className="font-semibold text-foreground truncate">
              {reviewData.title || "No title"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">
              Classification & Priority:
            </span>
            <p className="font-semibold text-foreground">
              {reviewData.type} ({reviewData.priority})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
