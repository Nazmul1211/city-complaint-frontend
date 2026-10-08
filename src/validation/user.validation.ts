import z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  contactNumber: z
    .string()
    .refine((val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val), {
      message:
        "Please provide a valid Bangladeshi phone number (e.g. 01712345678)",
    }),
  address: z.string().max(255, "Address cannot exceed 255 characters"),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
