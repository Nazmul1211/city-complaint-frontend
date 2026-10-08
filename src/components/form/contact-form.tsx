"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ward: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.add({
        title: "Validation Error",
        description:
          "Please fill in all required fields (Name, Email, Message).",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.add({
        title: "Inquiry Sent",
        description:
          "Your inquiry has been submitted to the municipal helpdesk.",
        type: "success",
      });
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Inquiry Successfully Transmitted
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Thank you for reaching out to the municipal corporation. A citizen
          liaison officer will review your message and reply to {formData.email}{" "}
          within 24 business hours.
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              ward: "",
              subject: "",
              message: "",
            });
          }}
          variant="outline"
          className="mt-6"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="text-xs font-medium text-foreground"
          >
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ayesha Siddiqua"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="text-xs font-medium text-foreground"
          >
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="e.g. ayesha@example.com"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-phone"
            className="text-xs font-medium text-foreground"
          >
            Phone Number (Optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+880 17XX XXXXXX"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-ward"
            className="text-xs font-medium text-foreground"
          >
            Municipal Ward (Optional)
          </label>
          <input
            id="contact-ward"
            type="text"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            placeholder="e.g. Ward 12, Mirpur"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-subject"
          className="text-xs font-medium text-foreground"
        >
          Subject / Department Inquiry
        </label>
        <input
          id="contact-subject"
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          placeholder="e.g. Inquiring about drainage overhaul schedule"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="text-xs font-medium text-foreground"
        >
          Detailed Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Please describe your question or suggestion in detail..."
          className="w-full rounded-md border border-input bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full gap-2"
      >
        <Send className="size-4" />
        {isSubmitting ? "Transmitting..." : "Send Municipal Inquiry"}
      </Button>
    </form>
  );
}
