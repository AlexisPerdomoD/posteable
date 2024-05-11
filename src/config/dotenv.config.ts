import { config } from "dotenv"

config({
    path: ".env",
})
let {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    ENDPOINT_ID,
    PORT,
    SECRET_TOKEN,
    SECRET_COOKIE,
    MODE,
    HOST
} = process.env
export default {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    ENDPOINT_ID,
    PORT,
    SECRET_TOKEN,
    SECRET_COOKIE,
    MODE,
    HOST
}

