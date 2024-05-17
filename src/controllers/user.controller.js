import pool from "../db/database.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";

class UserController {
    async registerUser(req, res){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json(errors);
            }
            const {email, login, password} = req.body;
            const id = Date.now();
            const userData = await userService.Registration(id, email, login, password);
            console.log(userData);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some registration erorr", result: false});
        }
    }
    async login(req, res){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json(errors);
            }
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            console.log(userData);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);

        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some login error", result: false});
        }

    }
    async logout(req, res){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some logout error", result: false});
        }
    }
    async refresh(req, res){
        try{
            const refreshToken = req.cookies.refreshToken;
            const userData = await userService.refresh(refreshToken);
            console.log(userData);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some refresh error", result: false});
        }
    }
    async getOneUser(req, res){
        try{
            const id = req.params.id;
            const userData = await userService.getOneUser(id);
            console.log(userData);
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get erorr", result: false});
        }
    }
    
    async getAllUsers(req, res){
        try{
            const users = await pool.query(`SELECT * FROM "User"`);
            console.log(users.rows);
            return res.json(users.rows);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get erorr", result: false});
        }
    }
    
    async updateLogin(req, res){
        try{
            const id = req.params.id;
            const {login} = req.body;
            const userData = await userService.updateLogin(id, login);
            console.log(userData);
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some update erorr", result: false});
        }
    }
    async updateSkin(req, res){
        try{
            const id = req.params.id;
            const {skin} = req.body;
            const userData = await userService.updateSkin(id, skin);
            console.log(userData);
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some update erorr", result: false});
        }
    }
    
    async deleteUser(req, res){
        try{
            const id = req.params.id;
            const userData = await userService.deleteUser(id);
            console.log(userData);
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some delete erorr", result: false});
        }
    }
}
export default new UserController();