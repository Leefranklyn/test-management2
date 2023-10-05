import { z } from "zod";

export const registrationValidator = z.object({
  firstName: z.string().min(2).max(255),
  lastName:z.string().min(2).max(255),
  userName: z.string().min(5).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  // institution: z.string().min(1).max(255),
});


export const loginValidator = z.object({
  userName: z.string(),
  password: z.string().min(6).max(255),
  });
  