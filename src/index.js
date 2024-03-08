import express from 'express';
import user_router from './routes/user.routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api', user_router);

app.listen(PORT, () => console.log("Server is running on port " + PORT));