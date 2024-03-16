import pool from "../db/database.js";
import tokenService from "../services/token.service.js";
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
            return res.json(await userService.Registration(id, email, login, password));
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some registration erorr"});
        }
    }
    async login(req, res){
        try{
            
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json(errors);
            }

            const {email, password} = req.body;
            const hashPassword = (await pool.query(`SELECT password from "User" WHERE email=$1`, [email])).rows[0]; //Получаем зашифрованный пароль

            if (hashPassword === undefined){ //Если hashPassword === undefined, то это значит, что пользователя с таким e-mail нет в бд.
                return res.status(400).json({message: "Incorrect e-mail.", result: false})
            }

            const logResult = await userService.login(password, hashPassword.password);
            if (!logResult.result){
                return res.status(400).json(logResult);
            }

            return res.json(logResult);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some login error"});
        }

    }
    async logout(req, res){

    }
    async refresh(req, res){

    }
    async activate(req, res){

    }

    async getOneUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`SELECT * FROM "User" WHERE id=$1`, [id]);
            return res.json(user.rows[0]);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get erorr"});
        }
    }
    
    async getAllUsers(req, res){
        try{
            const users = await pool.query(`SELECT * FROM "User"`);
            return res.json(users.rows);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get erorr"});
        }
    }
    
    async updateUser(req, res){
        try{
            const id = req.params.id;
            const {email, login, password} = req.body;
            const hashPassword = userService.passwordEncrypt(password);
            const check = await userService.userDataCheck(email, login);
        
            if (check.result){
                const user = await pool.query(`UPDATE "User" set email=$1, login=$2, password=$3 WHERE id=$4 RETURNING *`, 
                [email, login, hashPassword, id]);
                return res.json(user.rows[0]);
            }
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some update erorr"});
        }
    }
    
    async deleteUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`DELETE FROM "User" WHERE id=$1`, [id]);
            return res.json(user.rows[0]);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some delete erorr"});
        }
    }
}
export default new UserController();