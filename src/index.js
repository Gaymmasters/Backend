import express from 'express';
import user_router from './routes/user.routes.js';
import 'dotenv/config'; //Использование переменных из .env


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api', user_router);

const start = async () => {
    try{
        app.listen(PORT, () => console.log("Server is running on port " + PORT));
    }catch(e){
        console.log(e);
    }
}
start();