import { Router } from "express";
import {  requestAdminPasswordResetOTP, verifyAdminPasswordResetOTP, resetPassword, adminLogin, getAdmin, getAdminInstitution, getInstitutionTest, updateInstitutionAndAdmin, updateTest, updateTestQuestionImage, updateInstitutionAdminProfilePhoto, updateInstitutionSchoolLogo, updateInstitutionProprietorSignature } from "../../controllers/admin/admin.controller.js";
import { getAllUsers, getUsersWithResults } from "../../controllers/user/user.controller.js";
import { verifyToken } from "../../middleware/jwt.js";
import upload from "../../config/multer.js";
const router = Router();

router.post("/login", adminLogin);
router.post("/requestotp", requestAdminPasswordResetOTP);
router.post("/verifyotp/:adminId", verifyAdminPasswordResetOTP);
router.patch("/resetPassword/:adminId", resetPassword);
router.get("/:adminId", verifyToken("admin"), getAdmin);
router.get("/institution/:adminId", verifyToken("admin"), getAdminInstitution);
router.get("/institution/test/:adminId", verifyToken("admin"), getInstitutionTest);
router.get("/institution/users/:adminId", verifyToken("admin"), getAllUsers);
router.get("/institution/userswithresults/:adminId", verifyToken("admin"), getUsersWithResults);
router.post("/adminprofilephoto/upload/:adminId", verifyToken("admin"), upload("admin").single("adminProfilePhoto"), updateInstitutionAdminProfilePhoto);
router.post("/schoolLogo/upload/:adminId", verifyToken("admin"), upload("admin").single("schoolLogo"), updateInstitutionSchoolLogo);
router.post("/proprietorsignature/upload/:adminId", verifyToken("admin"), upload("admin").single("proprietorSignature"), updateInstitutionProprietorSignature);
router.patch("/update/:adminId", verifyToken("admin"), updateInstitutionAndAdmin);
router.patch("/test/questionimage/upload/:adminId", verifyToken("admin"),upload("test").single("questionImage"), updateTestQuestionImage)
router.patch("/test/update/:adminId", verifyToken("admin"), updateTest);
export default router;