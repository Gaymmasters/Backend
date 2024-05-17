import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import path from 'path';
import fs from 'fs';
import 'dotenv/config'; //Использование переменных из .env


const PORT = process.env.PORT || 3000;
const HTTPSPORT = process.env.HTTPSPORT;
const HTTPSHOST = process.env.HTTPSHOST;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);

const start = async () => {
    try{
        app.listen(PORT, () => console.log("Http server is running on port " + PORT));
        https.createServer(
            {
                key: fs.readFileSync("../config/localhost-key.pem"),
                cert: fs.readFileSync("../config/localhost.pem")
            },
            app
        ).listen(HTTPSPORT, HTTPSHOST, () => console.log("Https server is running on port " + HTTPSPORT))
    }catch(e){
        console.log(e);
    }
}
start();