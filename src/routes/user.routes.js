import { Router } from "express";
import userController from "../controllers/user.controller.js";

const user_router = new Router();

user_router.post('/user', userController.createUser);
user_router.get('/user', userController.getAllUsers);
user_router.get('/user/:id', userController.getOneUser);
user_router.put('/user/:id', userController.updateUser);
user_router.delete('/user/:id', userController.deleteUser);

export default user_router;