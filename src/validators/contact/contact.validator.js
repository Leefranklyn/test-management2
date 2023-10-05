import { z } from "zod";

export const contactUsValidator = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string()
});
