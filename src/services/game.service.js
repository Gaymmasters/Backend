import pool from "../db/database.js";
import Game from "../models/game.model.js";

class GameService {
    async getOneGame(id){
        const gameData = (await pool.query(`SELECT * from "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!gameData){
            return {message: "Incorrect id", result: false};
        }
        const game = new Game(gameData)
        
        return {...game, message: "Success", result: true};
    }
    async createGame(id, name, isPrivate, password, player1Id){
        const checkName = (await pool.query(`SELECT name FROM "Game" WHERE "name"=$1`, [name])).rows[0];
        const game = new Game({Id: id, name: name, isPrivate: isPrivate, password: password, player1Id: player1Id, moves: [], winFlag: 0});
        if (checkName){
            console.log(`Game with name: '${name}' already exists.`);
            return {...game, message: `Game with name: '${name}' already exists.`, result: false}
        }
        await pool.query(`INSERT INTO "Game"(id, "player1Id", "winFlag", "password", "moves", "name", "isPrivate") values($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id, player1Id, game.winFlag, password, game.moves, name, isPrivate]);
        return {...game, message: "Game has been successfully created", result: true};
    }
    async joinGame(player2Id, name, password){
        const findGame = (await pool.query(`SELECT * FROM "Game" WHERE "name"=$1`, [name])).rows[0];
        if (!findGame){
            console.log(`Game with name: '${name}' doesn't exist.`);
            return {message: `Game with name: '${name}' doesn't exist.`, result: false}
        }
        const game = new Game({...findGame, player2Id: player2Id})
        console.log(game)
        if (game.isPrivate){
            if (game.password === password){
                await pool.query(`UPDATE "Game" SET "player2Id"=$1 WHERE "name"=$2`, [player2Id, name]);
                return {...game, message: "You have been successfully joined the game", result: true}
            }
            return {...game, message: "Incorrect password", result: false}
        }
        await pool.query(`UPDATE "Game" SET "player2Id"=$1 WHERE "name"=$2`, [player2Id, name]);
        return {...game, message: "You have been successfully joined the game", result: true}
    }
    async getMoves(id){
        const checkGame = (await pool.query(`SELECT * FROM "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!checkGame){
            console.log(`Game with id: '${id}' doesn't exist.`);
            return {message: `Game with id: '${id}' doesn't exist.`, result: false}
        }
        const game = new Game(checkGame);
        return game.moves;
    }
    async flagWinner(id, winFlag){
        const checkGame = (await pool.query(`SELECT * FROM "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!checkGame){
            console.log(`Game with id: '${id}' doesn't exist.`);
            return {message: `Game with id: '${id}' doesn't exist.`, result: false};
        }
        await pool.query(`UPDATE "Game" SET "winFlag"=$1 WHERE "id"=$2`, [winFlag, id])
        const game = new Game({...checkGame, winFlag: winFlag});
        return {...game, message: "Winner has been flagged", result: true};
    }
    async makeMove(id, move){
        const checkGame = (await pool.query(`SELECT * FROM "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!checkGame){
            console.log(`Game with id: '${id}' doesn't exist.`);
            return {message: `Game with id: '${id}' doesn't exist.`, result: false};
        }
        const game = new Game(checkGame);
        game.moves.push(move);
        await pool.query(`UPDATE "Game" SET "moves"=$1 WHERE "id"=$2`, [game.moves, id]);
        return {...game, message: "Move has been recorded", result: true};
    }
}

export default new GameService();