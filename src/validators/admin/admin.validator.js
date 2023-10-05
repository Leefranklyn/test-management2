import { z } from "zod";

export const loginValidator = z.object({
    adminEmail: z.string().email(),
    adminPassword: z.string().min(6),
 });

 export const updateValidator = z.object({
    adminFirstName: z.string().min(2).max(255).optional(),
    adminLastName: z.string().min(2).max(255).optional(),
    adminProfilePhoto: z.string().optional(),
    adminEmail: z.string().email().optional(),
    adminPhone: z.string().min(6).max(20).optional(),
    adminPassword: z.string().min(6).optional(),
    adminGender: z.enum(["MALE", "FEMALE"]).optional(),
    // institution: z.string().refine(
    //   (value) => /^[0-9a-fA-F]{24}$/.test(value),
    //   {
    //     message: "Invalid ObjectId format",
    //   }
    // ).optional(), 
  });
  