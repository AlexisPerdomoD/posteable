import { Request, Response } from "express"
import { Err, Res } from "../models/general.model"
import { Post, TokenInfo, User } from "../models/schemas.model"
import { checkToken } from "../utiilities/checkToken"
import factory from "../dao/factory"
const um = factory.um()
const pm = factory.pm()
const lm = factory.lm()

const validateForLikesMidleeare = async (
    req: Request
): Promise<{ user: User; post: Post } | Err> => {
    const current: TokenInfo | Err = checkToken(req)
    if ("error" in current)
        return {
            error:true,
            cause: current.cause || "Authentication Error",
            message: current.message,
            status: current.status,
        }
    const id = parseInt(req.params.id)
    if (isNaN(id) || id < 1) {
        return {
            error:true,
            name: "TypeError",
            message: "Invalid Post id",
            status:400
        }
    }
    const user: User | Err = await um.getUser(current.username)
    if ("error" in user)
        return {
            error:true,
            name: user.name || "CastError",
            message: user.message,
            cause: user.cause,
            status: user.status,
        }

    const post: Res<Post> | Err = await pm.getPostById(id)
    if ("error" in post)
        return {
            error:true,
            name: post.name || "Error",
            message: post.message,
            status: post.status,
        }
    return {
        user,
        post: post.data,
    }
}

export const createLikeCtr = async(req: Request, res: Response) => {
    const v = await validateForLikesMidleeare(req)
    if("error" in v)return res.status(v.status).send({
        name:v.name,
        message:v.message,
        status:v.status,
        cause:v.cause,
    })
    const {user, post} = v
    const like = await lm.getLikeInfo(user, post)
    if(like !== null && "error" in like)return res.status(like.status).send({
        name:like.name,
        message:like.message,
        cause:like.cause,
        status:like.status
    })
    if(like !== null)return res.status(400).send({
        error:"CastError",
        message:"liked already created before",
        status:400
    })
    const r = await lm.createLike(user, post)
    if ("error" in r)
        return res.status(r.status).send({
            name: r.name || "Error",
            message: r.message,
            status: r.status,
            cause: r.cause,
        })
    return res.send({
        ok:true
    })
}
export const removeLikeCtr = async(req: Request, res: Response) => {
    const v = await validateForLikesMidleeare(req)
    if("error" in v)return res.status(v.status).send({
        name:v.name,
        message:v.message,
        status:v.status,
        cause:v.cause,
    })
    const {user, post} = v
    const like = await lm.getLikeInfo(user, post)
    
    if(like !== null && "error" in like)return res.status(like.status).send({
        name:like.name,
        message:like.message,
        cause:like.cause,
        status:like.status
    })
    if(like === null)return res.status(400).send({
        error:"CastError",
        message:"liked does not exist",
        status:404
    })
    const r = await lm.removeLike(user, post)
    if ("error" in r)
        return res.status(r.status).send({
            name: r.name || "Error",
            message: r.message,
            status: r.status,
            cause: r.cause,
        })
    return res.send({
        ok:true
    })
}  
