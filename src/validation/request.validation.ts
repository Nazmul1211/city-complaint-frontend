import z from "zod";

export const createServiceRequestSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  type: z.enum(["COMPLAINT", "SERVICE", "INFORMATION"], {
    message: "Please select a request type",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  wardId: z.string().min(1, "Please select a ward"),
  addressLine: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .max(500, "Address cannot exceed 500 characters"),
  landmark: z
    .string()
    .max(200, "Landmark cannot exceed 200 characters")
    .optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const feedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters long")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type CreateServiceRequestFormData = z.infer<
  typeof createServiceRequestSchema
>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
