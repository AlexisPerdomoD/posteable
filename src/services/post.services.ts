import { Request, Response } from "express"
import { Err, Query, Res, querySchema } from "../models/general.model"
import factory from "../dao/factory"
import { checkToken } from "../utiilities/checkToken"
import { Post, TokenInfo, User, postSchema } from "../models/schemas.model"
import logger from "../config/logger.config"
import { SafeParseReturnType } from "zod"
const pm = factory.pm()
const um = factory.um()
export const GetPostsCtr = async (req: Request, res: Response) => {
    const querys = querySchema.safeParse(req.query)
    if (querys.success === false) {
        return res.status(400).send({
            name: querys.error.name,
            errors: querys.error.errors.join(" "),
            cause: querys.error.cause,
            message: querys.error.message,
        })
    }

    const r = await pm.getPosts(querys.data)
    if ("error" in r) {
        if (r.status === 500)
            logger.log(
                "fatal",
                `${r.name || "Error"} 
            ${r.message || "error without information"}
            ${r.code || 0}
            ${r.cause}`
            )
        return res.status(r.status).send({
            error: r.cause || r.name || "ERROR",
            message: r.message,
            status: r.status,
        })
    }
    return res.send(r)
}
export const getLikedPostsCtr = async (req: Request, res: Response) => {
    const current: TokenInfo | Err = checkToken(req)
    if ("error" in current)
        return res.status(current.status).send({
            error: current.cause || "Authentication Error",
            message: current.message,
            status: current.status,
        })
    const q: SafeParseReturnType<typeof req.query, Query> =
        querySchema.safeParse(req.query)
    if (!q.success)
        return res.status(400).send({
            error: q.error.name,
            message: q.error.message,
            status: 400,
        })
    const user: User | Err = await um.getUser(current.username)
    if ("error" in user)
        return res.status(user.status).send({
            name: user.name || "CastError",
            message: user.message,
            cause: user.cause,
            status: user.status,
        })
    const r = await pm.getPostsLikedByUser(user, q.data)
    if ("error" in r)
        return res.status(r.status).send({
            name: r.name || "Error",
            message: r.message,
            status: r.status,
            cause: r.cause,
        })
    return res.send(r)
}
export const createPostCtr = async (req: Request, res: Response) => {
    const currentUser = checkToken(req)
    if ("error" in currentUser)
        return res.status(currentUser.status).send({
            error: currentUser.cause || "ERROR",
            message: currentUser.message,
        })
    const u = await um.getUser(currentUser.username)
    if ("error" in u)
        return res.status(u.status).send({
            error: u.cause || u.name || "ERROR",
            message: u.message,
        })

    const postInfo = postSchema.safeParse({ user_id: u.id, ...req.body })

    if (postInfo.success === false) {
        return res.status(400).send({
            name: postInfo.error.name,
            errors: postInfo.error.errors.join(" "),
            cause: postInfo.error.cause,
            message: postInfo.error.message,
        })
    }

    const r = await pm.createPost(postInfo.data, u.username)

    if ("error" in r) {
        if (r.status === 500)
            logger.log(
                "fatal",
                `${r.name || "error"} 
            ${r.message || "error without information"}
            ${r.code || 0}
            ${r.cause}`
            )
        return res.status(r.status).send({
            error: r.cause || r.name || "error",
            message: r.message,
            status: r.status,
        })
    }
    return res.send(r)
}
export const updatePostCtr = async (req: Request, res: Response) => {
    const current: TokenInfo | Err = checkToken(req)
    if ("error" in current)
        return res.status(current.status).send({
            error: current.cause || "authentication error",
            message: current.message,
            status: current.status,
        })
    const id = parseInt(req.params.id)
    if (isNaN(id) || id < 1) {
        return res.status(400).send({
            name: "TypeError",
            message: "Invalid Post id",
        })
    }
    if (!req.body.content || typeof req.body.content !== "string")
        return res.status(400).send({
            name: "TypeError",
            message:
                "content is not present or have an invalid type in the body request",
            status: 400,
        })
    const user: User | Err = await um.getUser(current.username)
    if ("error" in user)
        return res.status(user.status).send({
            name: user.name || "CastError",
            message: user.message,
            cause: user.cause,
            status: user.status,
        })
    const post: Res<Post> | Err = await pm.getPostById(id)
    if ("error" in post)
        return res.status(post.status).send({
            name: post.name || "Error",
            message: post.message,
            status: post.status,
        })
    if (post.data.user_id !== user.id)
        return res.status(403).send({
            name: "Authoritation Error",
            message: "only owners can update their posts",
            status: 403,
        })
    const r = await pm.updatePost(post.data, req.body.content)
    if ("error" in r)
        return res.status(r.status).send({
            name: r.name || "Error",
            message: r.message,
            status: r.status,
            cause: r.cause,
        })
    return r
}
export const deletePostCtr = async (req: Request, res: Response) => {
    const current: TokenInfo | Err = checkToken(req)
    if ("error" in current)
        return res.status(current.status).send({
            error: current.cause || "Authentication Error",
            message: current.message,
            status: current.status,
        })
    const id = parseInt(req.params.id)
    if (isNaN(id) || id < 1) {
        return res.status(400).send({
            name: "TypeError",
            message: "Invalid Post id",
        })
    }
    const user: User | Err = await um.getUser(current.username)
    if ("error" in user)
        return res.status(user.status).send({
            name: user.name || "CastError",
            message: user.message,
            cause: user.cause,
            status: user.status,
        })
    const post: Res<Post> | Err = await pm.getPostById(id)
    if ("error" in post)
        return res.status(post.status).send({
            name: post.name || "Error",
            message: post.message,
            status: post.status,
        })
    if (post.data.user_id !== user.id)
        return res.status(403).send({
            name: "Authoritation Error",
            message: "only owners can update their posts",
            status: 403,
        })
    const r = await pm.deletePost(post.data)
    if (r)
        return res.status(r.status).send({
            name: r.name || "Error",
            message: r.message,
            status: r.status,
            cause: r.cause,
        })
    return res.send({
        ok: true,
    })
}
export const updateLikeCtr = async (req: Request, res: Response) => {} //todo
