import { Router } from "express";
import { sendContactUsMessage } from "../../controllers/contact/contactUs.controller.js";
const router = Router()

router.post("/contact/:id", sendContactUsMessage);

export default router;

