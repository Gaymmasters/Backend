import pool from "../db/database.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
import User from "../models/user.model.js";

class UserService {

    async Registration(id, email, login, password){
        const checkEmail = (await pool.query(`SELECT email FROM "User" WHERE email=$1`, [email])).rows[0]; // Если пользователя с такой почтой нет, то вернет undefined
        const checkLogin = (await pool.query(`SELECT login FROM "User" WHERE login=$1`, [login])).rows[0]; 
        const hashPassword = await this.passwordEncrypt(password);
        const user = new User(id, email, login, hashPassword); //создаем модель user

        if (checkEmail){ //проверяем уникальность почты
           console.error(`User with e-mail: '${email}' already exists.`);
           return {...user, message: `User with e-mail: '${email}' already exists.`, result: false};
        }
        else if (checkLogin){//Проверяем уникальность логина
            console.error(`User with login: '${login}' already exists.`);
            return {...user, message: `User with login: '${login}' already exists.`, result: false};
        }
        await pool.query(`INSERT INTO "User" values($1, $2, $3, $4) RETURNING *`,
        [id, email, login, hashPassword]); //добавляем пользователя в бд

        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return {...user, message: "Everything is fine", result: true, ...tokens};
    }

    async passwordEncrypt(password){
        return bcrypt.hash(password, 4);
    }

    async deleteUser(id){
        const userData = (await pool.query(`SELECT * from "User" WHERE Id=$1`, [id])).rows[0];

        if (!userData){
            return {message:"Incorrect id", result: false};
        }
        const user = new User(userData.id, userData.email, userData.login, userData.password, userData.skin);

        await pool.query(`DELETE FROM "User" WHERE id=$1`, [id]);

        return {...user, message: "User has been deleted", result: true};
    }

    async updateUser(id, login, password, skin){
        const userData = (await pool.query(`SELECT * from "User" WHERE Id=$1`, [id])).rows[0];

        if (!userData) {
            return {message: "Incorrect id", result: false};
        }
        const hashPassword = await this.passwordEncrypt(password);

        const user = new User(userData.id, userData.email, login, hashPassword, skin);

        await pool.query(`UPDATE "User" SET "login"=$1, "password"=$2, "skin"=$3 WHERE Id=$4`, [login, hashPassword, skin, id]);

        return {...user, message: "User has been updated", result: true};
    }

    async getOneUser(id){
        const userData = (await pool.query(`SELECT * from "User" WHERE Id=$1`, [id])).rows[0];

        if (!userData) {
            return {message: "Incorrect id", result: false};
        }
        const user = new User(userData.id, userData.email, userData.login, userData.password, userData.skin);

        return {...user, message: "Success", result: true};
    }

    async login(email, password){
        const checkEmail = (await pool.query(`SELECT email FROM "User" WHERE email=$1`, [email])).rows[0]; // Если пользователя с такой почтой нет, то вернет undefined

        const userData = (await pool.query(`SELECT * from "User" WHERE email=$1`, [email])).rows[0];
        
        if (!checkEmail){ //проверяем уникальность почты
           console.error(`User with e-mail: '${email}' doesn't exist.`);
           return {message: `User with e-mail: '${email}' doesn't exist.`, result: false};
        }
        const IsPasswordValid = await bcrypt.compare(password, userData.password); // Проверяем пароль
        const user = new User(userData.id, userData.email, userData.login, userData.password);
        if (!IsPasswordValid)
            return {...user, message: `Invalid password`, result: false};

        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return {...user, message: `You have successfully logged in`, result: true, ...tokens};
    } 

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    
    async refresh(refreshToken){
        const userID = (await pool.query(`SELECT "userId" FROM "UserToken" WHERE "refreshToken"=$1`, [refreshToken])).rows[0].userId;
        const userData = (await pool.query(`SELECT * from "User" WHERE Id=$1`, [userID])).rows[0];
        const user = new User(userData.id, userData.email, userData.login, userData.password);

        if (!refreshToken){
            return {...user, message: `Token is null or undefined`, result: false};
        }
        const userToken = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDataBase = await tokenService.findToken(refreshToken);
        if (!userToken || !tokenFromDataBase){
            return {...user, message: `Bad token`, result: false};
        }

        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return {...user, message: `Token has been successfully updated`, result: true, ...tokens};
    }
}

export default new UserService();