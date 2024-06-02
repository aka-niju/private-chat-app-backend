import express from 'express';
import dotenv from 'dotenv';

import connectToDB from './db/connectToDB.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.get('/', (req, res)=> {
    return res.send("Homepage");
})

app.listen(port, ()=> {
    connectToDB(process.env.DB_NAME);
    console.log(`Server is running at ${port}`);
})

