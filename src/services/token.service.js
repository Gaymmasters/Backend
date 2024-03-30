import jwt from 'jsonwebtoken';
import pool from '../db/database.js';
import "dotenv/config"; 

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = (await pool.query(`SELECT "RefreshToken" FROM "UserToken" WHERE "UserId"=$1`, [userId])).rows[0];
        if (tokenData){
            return await pool.query(`UPDATE "UserToken" SET "RefreshToken"=$1 WHERE "UserId"=$2`, [refreshToken, userId]);
        }
        const token = await pool.query(`INSERT INTO "UserToken" values($1, $2)`, [userId, refreshToken]);
        return token.rows[0];
    }
    async removeToken(refreshToken){
        try{
        const tokenData = await pool.query(`DELETE FROM "UserToken" WHERE "RefreshToken"=$1`, [refreshToken]);
        return {...tokenData, message: "Success", result: true};
        }catch(e){
            console.log(e);
            return {message: "Some removeToken error", result: false};
        }
    }
    async validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    }
    async validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    }
    async findToken(refreshToken){
        const tokenData = (await pool.query(`SELECT "RefreshToken" FROM "UserToken" WHERE "RefreshToken"=$1`, [refreshToken])).rows[0];
        return tokenData;
    }
}
export default new TokenService;