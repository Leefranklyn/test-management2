import Contact from "../../models/contact/contact.model.js";
import { contactUsValidator } from "../../validators/contact/contact.validator.js";
import { formatZodError } from "../../utils/errorMessage.js";
import { contactUs } from "../../utils/mailing.js";

export const sendContactUsMessage = async (req, res) => {
  try {
    const contactUsValidatorResult= contactUsValidator.safeParse(req.body);
    if(!contactUsValidatorResult.success) {
      return res.status(400).json(formatZodError(contactUsValidatorResult.error.issues))
    };
  
    const { name, email, message } = req.body;
    const newContactUsMessage = new Contact({
      name,
      email,
      message
    });
    await newContactUsMessage.save();
    await contactUs(newContactUsMessage.name, newContactUsMessage.email, newContactUsMessage.message);
    res.status(200).json({
      success: true,
      message: "message sent successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Sending Message",
      error
    })
  }
 };
