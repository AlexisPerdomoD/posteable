import { PoolClient } from "pg";
import connectPG, {closeDB} from "../config/pg.config";
import PostManager from './post.manager';
import UserManager from "./user.manager";
import logger from "../config/logger.config";
import LikeMannager from "./like.manager";

//exportamos una funcion con la instancia del cliente de la base de datos y el manager de encargarse de hacer las peticiones retornando una promesa. de esta manera en el futuro de querer cambiar nuestra base de datos o sistema de persistencia no necesitamos afectar la logica de negocio de la aplicacion
 class DAO{
     private clientDB:PoolClient | null = null
     private async getDB(){
        if(!this.clientDB){
            this.clientDB = await connectPG()
            return this.clientDB
        }
    return this.clientDB
    }
    async close(){
        await closeDB()
        logger.info("base de datos cerrada, terminando aplicacion")
    } 
    pm = () => new PostManager(this.getDB)
    um = () => new UserManager(this.getDB)
    lm = () => new LikeMannager(this.getDB)
 }
export default new DAO()
