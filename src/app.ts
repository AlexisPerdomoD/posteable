import express from "express";
import envConfig from "./config/dotenv.config";
import postRouter from "./routers/posts.route";
import userRouter from "./routers/users.route";
import cookieP from "cookie-parser"
import  {loggerMidleware} from "./config/logger.config";
import cors from "cors"
const app = express()
app.use(cors({
    origin: envConfig.HOST,
    methods:["GET","POST","PUT", "DELETE"],
    allowedHeaders:['Content-Type']
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieP(envConfig.SECRET_COOKIE))

app.use(loggerMidleware)
app.use(userRouter)
app.use(postRouter)

export default app
