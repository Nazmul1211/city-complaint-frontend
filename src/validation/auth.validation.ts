import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password cannot exceed 32 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const loginSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: passwordSchema,
});

// Alias for backwards compatibility if referenced
export const LoginZodSchema = loginSchema;

export const citizenRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters"),
    email: z.email("Please provide a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .refine((val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val), {
        message: "Please provide a valid Bangladeshi phone number",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const citizenEmailVerifySchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please provide a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    email: z.email("Please provide a valid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type CitizenRegistrationFormData = z.infer<
  typeof citizenRegistrationSchema
>;
export type CitizenEmailVerifyFormData = z.infer<
  typeof citizenEmailVerifySchema
>;
