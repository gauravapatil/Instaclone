import express from "express";
import { register,login,logout,suggestedUser,editProfile,followOrUnfollow,getProfile } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import multer from "multer";
import upload from "../middleware/multer.js";


const router=express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated,getProfile);
router.route("/profile/edit").post(isAuthenticated,upload.single('profilePic'),editProfile);
router.route("/suggested").get(isAuthenticated,suggestedUser);
router.route("/followOrUnfollow/:id").post(isAuthenticated,followOrUnfollow)

export default router;

