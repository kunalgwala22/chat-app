import express from 'express'
import authRoute from './routes/authRoutes.js'
import dotenv from 'dotenv'
import { connectDB } from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/messaageRoutes.js'
import cors from 'cors'
import { app, server } from './config/socket.js';
import path from "path"



const port = 8000 || process.env.port ;

dotenv.config();
connectDB();

const __dirname=path.resolve()

app.use(express.json({ limit: '50mb' })); // Increase limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); 
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Server is running...');
  });
  
app.use('/api/auth',authRoute)
app.use('/api/messages',messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../Frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"))
  })
}

server.listen(port,()=>{
    console.log(`server is running at port ${port}`);

})