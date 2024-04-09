import express from "express";
import User from "../controllers/user";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middle";
const router = express.Router()
export default(io:Server) => {
    const Middle = new MiddleWare()
    const UserController = new User(io);

    router.post('/',Middle.verify,UserController.getUser)
    router.patch('/update',Middle.verify,UserController.updateUser)
    router.post('/search',Middle.verify, UserController.searchUserDetail)
    router.get('/search/:key',UserController.searchUser)
    router.get('/friend',Middle.verify, UserController.getFriendByUser)
    router.post('/friend',Middle.verify,UserController.addFriend)
    router.patch('/friend',Middle.verify,UserController.changeFriendField)
    return router
}