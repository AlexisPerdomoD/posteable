import { Router } from "express";
import { getLikedPostsCtr, GetPostsCtr, createPostCtr, updatePostCtr, deletePostCtr } from "../services/post.services";
import {createLikeCtr, removeLikeCtr} from "../services/like.service";

const postRouter = Router()

postRouter.get("/", GetPostsCtr)
postRouter.get("/likes", getLikedPostsCtr)
postRouter.post("/post", createPostCtr)
postRouter.patch("/post/:id", updatePostCtr)
postRouter.delete("/post/:id", deletePostCtr)
postRouter.post("/post/:id/like", createLikeCtr)
postRouter.delete("/post/:id/like", removeLikeCtr)
 
export default postRouter
