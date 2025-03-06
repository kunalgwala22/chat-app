import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { deleteMessage, getMessage, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";

const router =express.Router();

router.get('/users',protectRoute,getUsersForSidebar)
router.get('/:id',protectRoute,getMessage)
router.post('/send/:id',protectRoute,sendMessage)

router.post('/delete-message',protectRoute,deleteMessage)


export default router