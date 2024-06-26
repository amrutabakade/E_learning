import express from 'express'
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';

dotenv.config();
const app = express();

app.use(express.json())
const PORT = process.env.PORT

app.get('/',(req,res)=>
{
    res.send("server is working");
})//shows the response on browser

app.use("/uploads",express.static("uploads"));
//importing routs
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

app.use("/api",userRoutes);
app.use("/api",courseRoutes);
app.use("/api",adminRoutes);


app.listen(5000,()=>{
    console.log(`http://localhost:${PORT}`);
    connectDb()
})