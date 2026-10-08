"use client";

import { useForm } from "@tanstack/react-form";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useSubmitFeedback } from "@/hooks";
import type { Feedback } from "@/types";
import { feedbackSchema } from "@/validation";

interface FeedbackModalProps {
  requestId: string;
  requestTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (feedback: Feedback) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 Star — Unsatisfactory resolution",
  2: "2 Stars — Needs noticeable improvement",
  3: "3 Stars — Acceptable standard service",
  4: "4 Stars — Thorough and prompt work",
  5: "5 Stars — Outstanding civic response",
};

export function FeedbackModal({
  requestId,
  requestTitle,
  open,
  onOpenChange,
  onSuccess,
}: FeedbackModalProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const { mutate: submit, isPending } = useSubmitFeedback();

  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    onSubmit: ({ value }) => {
      submit(
        {
          requestId,
          payload: {
            rating: value.rating,
            comment: value.comment,
          },
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Feedback Submitted",
              description:
                "Thank you for rating the city's complaint resolution service.",
              type: "success",
            });
            form.reset();
            onOpenChange(false);
            if (res?.data && onSuccess) {
              onSuccess(res.data);
            }
          },
          onError: (err: Error) => {
            toast.add({
              title: "Submission Error",
              description:
                err?.message ||
                "Unable to submit review. You can only submit feedback once per resolved complaint.",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Rate Resolution Quality
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {requestTitle
              ? `Provide feedback on: "${requestTitle}"`
              : "Help the municipality measure response effectiveness and technician service."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 pt-1"
        >
          {/* Star Rating Selector */}
          <form.Field name="rating">
            {(field) => {
              const currentRating = field.state.value;
              const displayRating = hoverRating ?? currentRating;

              return (
                <Field className="space-y-2">
                  <FieldLabel className="text-xs font-semibold">
                    Service Satisfaction Rating
                  </FieldLabel>

                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= displayRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.handleChange(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="rounded-sm p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`${star} star rating`}
                        >
                          <Star
                            className={`size-6 transition-colors ${
                              isFilled
                                ? "fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500"
                                : "text-muted-foreground/40 hover:text-muted-foreground"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] font-medium text-muted-foreground min-h-[16px]">
                    {RATING_DESCRIPTIONS[displayRating] ||
                      "Select 1 to 5 stars"}
                  </p>
                  {field.state.meta.errors?.[0] && (
                    <FieldError>
                      {String(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Comment Field */}
          <form.Field name="comment">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-semibold"
                    >
                      Citizen Comments & Remarks
                    </FieldLabel>
                    <span className="text-[10px] text-muted-foreground">
                      {field.state.value.length} / 1000
                    </span>
                  </div>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Describe whether the issue was adequately fixed, speed of dispatch, or technician professionalism..."
                    rows={4}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="text-xs leading-relaxed"
                  />

                  {isInvalid && (
                    <FieldError>
                      {field.state.meta.errors?.[0]?.message}
                    </FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter className="pt-2 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="size-3.5 mr-1.5" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
