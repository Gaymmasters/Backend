import { hash } from "bcrypt";
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
            const check = await userService.userDataCheck(email, login); //Проверяем уникальность email и login
            const hashPassword = await userService.passwordEncrypt(password); //Шифруем пароль

            if (!check){    
                const newUser = await pool.query(`INSERT INTO "User" (id, email, login, password) values($1, $2, $3, $4) RETURNING *`,
                [id, email, login, hashPassword]);
                return res.json(newUser.rows[0]);
            }
            return res.status(400).json(check);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Registration erorr"});
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
            if (hashPassword === undefined){ //Если hasPassword === undefined, то это значит, что пользователя с таким e-mail нет в бд.
                return res.status(400).json({message: "Incorrect e-mail."})
            }

            const logResult = await userService.login(email, password, hashPassword.password);
            if (!logResult){
                return res.status(400).json(logResult);
            }
            
            return res.json(logResult);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Login error"});
        }

    }
    async getOneUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`SELECT * FROM "User" WHERE id=$1`, [id]);
            return res.json(user.rows[0]);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Get erorr"});
        }
    }
    
    async getAllUsers(req, res){
        try{
            const users = await pool.query(`SELECT * FROM "User"`);
            return res.json(users.rows);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Get erorr"});
        }
    }
    
    async updateUser(req, res){
        try{
            const id = req.params.id;
            const {email, login, password} = req.body;
            const hashPassword = userService.passwordEncrypt(password);
            const check = await userService.userDataCheck(email, login);
            if (!check){
                const user = await pool.query(`UPDATE "User" set email=$1, login=$2, password=$3 WHERE id=$4 RETURNING *`, 
                [email, login, hashPassword, id]);
                return res.json(user.rows[0]);
            }
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Update erorr"});
        }
    }
    
    async deleteUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`DELETE FROM "User" WHERE id=$1`, [id]);
            return res.json(user.rows[0]);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Delete erorr"});
        }
    }
}
export default new UserController();