import { Router } from "express";
import { userRegiistration, userLoginAndStartTest, submitUserResponse, getTestForUser, uploadUserProfilePhoto } from "../../controllers/user/user.controller.js";
import { verifyToken } from "../../middleware/jwt.js";
import upload from "../../config/multer.js";
const router = Router();

router.post("/signup/:adminId", verifyToken("admin"), userRegiistration);
router.post("/signup/upload/profilephoto/:adminId", verifyToken("admin"), upload("user").single("profilePhoto"), uploadUserProfilePhoto);
router.post("/login", userLoginAndStartTest);
router.get("/test/:userId", verifyToken("user"), getTestForUser);
router.post("/submit/:userId", verifyToken("user"), submitUserResponse);

export default router;
