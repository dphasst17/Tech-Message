import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
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

/* db.connectDB() */
app.get('/', (req, res) => {
  res.send('Hello World!')
})
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});