import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToDB from './db/connectToDB.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/users", userRoutes);

app.get('/', (req, res)=> {
    return res.send("Homepage");
});

app.listen(port, ()=> {
    connectToDB(process.env.DB_NAME);
    console.log(`Server is running at ${port}`);
})

