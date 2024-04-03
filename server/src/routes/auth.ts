import express from "express";
import Auth from "../controllers/auth";
import MiddleWare from "../middleware/middle";
const router = express.Router()
const AuthController = new Auth();
const Middle = new MiddleWare()
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.patch('/password/update',Middle.verify as any,AuthController.updatePassword as any)
export default router