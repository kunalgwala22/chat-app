import express from 'express'
import authRoute from './routes/authRoutes.js'
import dotenv from 'dotenv'
import { connectDB } from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/messaageRoutes.js'
import cors from 'cors'
import { app, server } from './config/socket.js';


const port = 8000 || process.env.port ;

dotenv.config();
connectDB();

app.use(express.json({ limit: '50mb' })); // Increase limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); 
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Server is running...');
  });
  
app.use('/api/auth',authRoute)
app.use('/api/messages',messageRoutes)

server.listen(port,()=>{
    console.log(`server is running at port ${port}`);

})