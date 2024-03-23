import pool from "../db/database.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import mailService from "./mail.service.js";
import tokenService from "./token.service.js";
import User from "../models/user.model.js";

class UserService {
    async Registration(id, email, login, password){
        const AllEmails = ((await pool.query(`SELECT email FROM "User"`)).rows).map((el) => el.email); // Получаем все электронные почты.
        const AllLogins = ((await pool.query(`SELECT login FROM "User"`)).rows).map((el) => el.login); // Получаем все логины.

        const hashPassword = await this.passwordEncrypt(password);
        const user = new User(id, email, login, hashPassword); //создаем модель user

        if (AllEmails.includes(email)){ //проверяем уникальность почты
           console.error(`User with e-mail: '${email}' already exists.`);
           return {...user, message: `User with e-mail: '${email}' already exists.`, result: false};
        }
        else if (AllLogins.includes(login)){//Проверяем уникальность логина
            console.error(`User with login: '${login}' already exists.`);
            return {...user, message: `User with login: '${login}' already exists.`, result: false};
        }
        const Candidat = await pool.query(`INSERT INTO "User"
        values($1, $2, $3, $4) RETURNING *`,
        [id, email, login, hashPassword]); //добавляем пользователя в бд

        const activationlink = v4();
        await mailService.sendActivationMail(email, activationlink);

        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return {...user, message: "Everything is fine", result: true, tokens: tokens};
    }
    async passwordEncrypt(password){
        return bcrypt.hash(password, 4);
    }
    async userDataCheck(email, login){
        const AllEmails = ((await pool.query(`SELECT email FROM "User"`)).rows).map((el) => el.email); 
        const AllLogins = ((await pool.query(`SELECT login FROM "User"`)).rows).map((el) => el.login);
        const user = {email, login};

        if (AllEmails.includes(email)){ //проверяем уникальность почты
            console.error(`User with e-mail: '${email}' already exists.`);
            return {...user, message: `User with e-mail: '${email}' already exists.`, result: false};
         }
         else if (AllLogins.includes(login)){//Проверяем уникальность логина
             console.error(`User with login: '${login}' already exists.`);
             return {...user, message: `User with login: '${login}' already exists.`, result: false};
         }
         return {...user, message: "Everything is fine", result: true}; 
    }
    async login(password, hashPassword){
        const IsPasswordValid = await bcrypt.compare(password, hashPassword)

        if (IsPasswordValid)
            return {message: `You have successfully logged in`, result: true};
        
        return {message: `Invalid password`, result: false};
    } 
}

export default new UserService();