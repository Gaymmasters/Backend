import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { body } from "express-validator";

const user_router = new Router();

user_router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 20}),
    userController.registerUser);
user_router.post('/login',
    body('email').isEmail(),
    userController.login);
user_router.get('/user', userController.getAllUsers);
user_router.get('/user/:id', userController.getOneUser);
user_router.put('/user/:id', userController.updateUser);
user_router.delete('/user/:id', userController.deleteUser);

export default user_router;