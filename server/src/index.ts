import express from "express";
import dotenv from "dotenv";
import * as db from "./models/connect"
import { createServer } from "http";
import { Server } from "socket.io";
import AuthRouter from "./routes/auth";
import ChatRouter from "./routes/chat";
import UserRouter from "./routes/user";
import NotiRouter from "./routes/notification"
import {collectionInfo } from "./models/collection";
import { socketUserStatus } from "./utils/socket";
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
});

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
    );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization");
    next();
});

const arrRoute = [
  {path:'chat',isApi:false,routes:ChatRouter(io)},
  {path:'auth',isApi:false,routes:AuthRouter(io)},
  {path:'noti',isApi:false,routes:NotiRouter},
  {path:'user',isApi:false,routes:UserRouter(io)},
]
arrRoute.map(r => app.use((r.isApi === true ? `/api/${r.path}`: `/${r.path}`),r.routes))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

db.connectDB()

io.on('connection', (socket) => {
  socket.on('user_disconnect',data => {
    collectionInfo.findOneAndUpdate({idUser:data},{$set:{online:false}})
    socketUserStatus(io,'offline',data)
  })
});


server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});