import express from "express";
import User from "../controllers/user";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middle";
const router = express.Router()
export default(io:Server) => {
    const Middle = new MiddleWare()
    const UserController = new User(io);

    router.post('/',Middle.verify as any,UserController.getUser as any)
    router.patch('/update',Middle.verify as any,UserController.updateUser)
    router.post('/search',Middle.verify as any, UserController.searchUserDetail as any)
    router.get('/search/:key',UserController.searchUser)
    router.post('/friend',Middle.verify as any,UserController.addFriend as any)
    router.patch('/friend',Middle.verify as any,UserController.changeFriendField as any)
    return router
}