import pool from "../db/database.js";

class UserController {
    async createUser(req, res){
        try{
            const {email, login, password} = req.body;
            const id = Date.now();
            const newUser = await pool.query(`INSERT INTO "User" (id, email, login, password) values($1, $2, $3, $4) RETURNING *`,
            [id, email, login, password])
            res.json(newUser.rows[0]);
        }catch(e){
            console.log(e)
            return res.status(400).json({message: "Registration erorr"});
        }
    }
    async getOneUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`SELECT * FROM "User" WHERE id=$1`, [id]);
            res.json(user.rows[0]);
        }catch(e){
            console.log(e)
            return res.status(400).json({message: "Get erorr"});
        }
    }
    
    async getAllUsers(req, res){
        try{
            const users = await pool.query(`SELECT * FROM "User"`);
            res.json(users.rows);
        }catch(e){
            console.log(e)
            return res.status(400).json({message: "Get erorr"});
        }
    }
    
    async updateUser(req, res){
        try{
            const id = req.params.id;
            const {email, login, password} = req.body;
            const user = await pool.query(`UPDATE "User" set email=$1, login=$2, password=$3 WHERE id=$4 RETURNING *`, 
            [email, login, password, id]);
            res.json(user.rows[0]);
        }catch(e){
            console.log(e)
            return res.status(400).json({message: "Update erorr"});
        }
    }
    
    async deleteUser(req, res){
        try{
            const id = req.params.id;
            const user = await pool.query(`DELETE FROM "User" WHERE id=$1`, [id]);
            res.json(user.rows[0]);
        }catch(e){
            console.log(e)
            return res.status(400).json({message: "Delete erorr"});
        }
    }
}
export default new UserController()