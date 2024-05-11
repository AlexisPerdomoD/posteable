import { PoolClient, QueryResult } from "pg"
import { Like, Post, User } from "../models/schemas.model"
import { Err } from "../models/general.model"

export default class LikeMannager {
    #getDb: () => Promise<PoolClient>
    constructor(getDB: () => Promise<PoolClient>) {
        this.#getDb = getDB
    }
    async getLikeInfo(user: User, post: Post): Promise<Like | null | Err> {
        try {
            const client = await this.#getDb()
            const r: QueryResult<Like> = await client.query(
                `
                SELECT * FROM "Likes" 
                WHERE user_id = $1 AND post_id = $2;`,
                [user.id, post.id]
            )
            if (r.rowCount === 0) return null
            return r.rows[0]
        } catch (error) {
            if (error instanceof Error)
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async createLike(user: User, post: Post): Promise<Like | Err> {
        try {
            const client = await this.#getDb()
            const r: QueryResult<Like> = await client.query(
                `
                INSERT INTO "Likes"(user_id, post_id, "createdAt") 
                VALUES($1, $2, $3) RETURNING *;`,
                [user.id, post.id, new Date()]  
            )
            return r.rows[0]
        } catch (error) {
            if (error instanceof Error)
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async removeLike(user: User, post: Post): Promise<Like | Err> {
        try {
            const client = await this.#getDb()
            const r: QueryResult<Like> = await client.query(
                `
                DELETE FROM "Likes" 
                WHERE user_id = $1 AND post_id = $2 RETURNING *;`,
                [user.id, post.id]
            )
            return r.rows[0]
        } catch (error) {
            if (error instanceof Error)
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
}
