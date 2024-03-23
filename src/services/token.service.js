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
        const tokenData = await pool.query(`SELECT * from "UserToken" WHERE "UserId"=$1`, [userId]).rows;
        if (tokenData){
            return await pool.query(`INSERT INTO "UserToken" values($1) WHERE UserID=$2`, [refreshToken, userId]);
        }
        const token = await pool.query(`INSERT INTO "UserToken" values($1, $2)`, [userId, refreshToken]);
        return token.rows[0];
    }
}
export default new TokenService;