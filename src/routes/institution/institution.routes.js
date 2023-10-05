import { Router } from "express";
import { completeInstitutionRegistration, completeInstitutionRegistrationProprietorSignature, completeInstitutionRegistrationSchoolLogo, getAdminInstitutionToCompleteRegistration, institutionAndAdminRegistration } from "../../controllers/institution/institution.controller.js";
import { verifyToken } from "../../middleware/jwt.js";
import upload from "../../config/multer.js";
const router = Router();

router.post("/signup", institutionAndAdminRegistration);
router.get("/:institutionId", getAdminInstitutionToCompleteRegistration);
router.post("/completeregistration/upload/schoollogo/:institutionId", upload("institution").single("schoolLogo"), completeInstitutionRegistrationSchoolLogo );
router.post("/completeregistration/upload/proprietorsignature/:institutionId", upload("institution").single("proprietorSignature"), completeInstitutionRegistrationProprietorSignature );
router.patch("/completeregistration/:institutionId", completeInstitutionRegistration );

export default router;
