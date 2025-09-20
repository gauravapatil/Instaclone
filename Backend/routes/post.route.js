import express from "express";
import upload from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { addNewPost, createComment, deletePost, getAllComments, getAllPosts, getUserPosts, likePost, saved, UnlikePost } from "../controller/post.controller.js";



const router=express.Router();

router.route("/addPost").post(isAuthenticated,upload.single('image'), addNewPost);
router.route("/all").get(isAuthenticated,getAllPosts);
router.route("/userpost/all").get(isAuthenticated,getUserPosts);
router.route("/:id/like").get(isAuthenticated,likePost);
router.route("/:id/dislike").get(isAuthenticated,UnlikePost);
router.route("/:id/comment").post(isAuthenticated,createComment);
router.route("/:id/comment/all").get(isAuthenticated,getAllComments);
router.route("/delete/:id").delete(isAuthenticated,deletePost);
router.route("/:id/bookmark").get(isAuthenticated,saved);

export default router;






