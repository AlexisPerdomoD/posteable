import app from "./app"
import envConfig from "./config/dotenv.config"
import logger from "./config/logger.config"
import DAO from "./dao/factory"








['SIGING', 'SIGTERM', 'SIGQUIT']
    .forEach((signal) => process.on(signal, async()=>{
            await DAO.close()
            process.exit(0)
        })
    )


const port = envConfig.PORT
app.listen(port, () => logger.info(`Escuchando al puerto ${port}`))

 
