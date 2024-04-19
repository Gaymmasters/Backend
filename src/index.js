import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'; //Использование переменных из .env


const PORT = process.env.PORT || 3000;
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
        app.listen(PORT, () => console.log("Server is running on port " + PORT));
    }catch(e){
        console.log(e);
    }
}
start();