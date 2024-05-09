import { Router } from "express";
import { getLikedPostsCtr, GetPostsCtr, createPostCtr, updateLikeCtr, updatePostCtr } from "../services/post.services";

const postRouter = Router()

postRouter.get("/", GetPostsCtr)
postRouter.get("/likes", getLikedPostsCtr)
postRouter.post("/post", createPostCtr)
postRouter.patch("/post/:id", updatePostCtr)
postRouter.post("/post/:id/like", updateLikeCtr)
postRouter.delete("/post/:id/like", updateLikeCtr)

export default postRouter
