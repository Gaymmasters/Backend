import "dotenv/config"; //Использование переменных из .env
import pg from "pg";

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

export default pool;