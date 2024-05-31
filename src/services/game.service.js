import pool from "../db/database.js";
import Game from "../models/game.model.js";
import { spawn } from 'child_process';

class GameService {
    async getOneGame(id){
        const gameData = (await pool.query(`SELECT * from "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!gameData){
            return {message: "Incorrect id", result: false};
        }
        const game = new Game(gameData)
        
        return {...game, message: "Success", result: true};
    }
    async deleteGame(id){
        const gameData = (await pool.query(`SELECT * from "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!gameData){
            return {message: "Incorrect id", result: false};
        }
        const game = new Game(gameData)

        await pool.query(`DELETE FROM "Game" WHERE "id"=$1`, [id]);

        return {...game, message: "Game has been successfully deleted", result: true};
    }
    async createGame(id, name, isPrivate, password, player1Id, isBot){
        const checkName = (await pool.query(`SELECT name FROM "Game" WHERE "name"=$1`, [name])).rows[0];
        const game = new Game({id: id, name: name, isPrivate: isPrivate, password: password, player1Id: player1Id, moves: [], winFlag: 0, isBot: isBot});
        if (checkName){
            console.log(`Game with name: '${name}' already exists.`);
            return {...game, message: `Game with name: '${name}' already exists.`, result: false}
        }
        await pool.query(`INSERT INTO "Game"(id, "player1Id", "winFlag", "password", "moves", "name", "isPrivate", "isBot") values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [id, player1Id, game.winFlag, password, game.moves, name, isPrivate, isBot]);
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
    async botMove(id, move, difficulty){
        const checkGame = (await pool.query(`SELECT * FROM "Game" WHERE "id"=$1`, [id])).rows[0];
        if (!checkGame){
            console.log(`Game with id: '${id}' doesn't exist.`);
            return {message: `Game with id: '${id}' doesn't exist.`, result: false};
        }
        const diff_to_recursion = [2, 4, 6];
        let _diff = 2;
        if (difficulty >=0 && difficulty <=2){
            _diff = diff_to_recursion[difficulty];
        }

        const game = new Game(checkGame);
        game.moves.push(move);
        const gameMatrix = matrix(game.moves);

        const result = await runPythonScript([move[3], JSON.stringify(gameMatrix), _diff]);
        const botMove = "b" + move[3] + "s" + result[0];
        game.moves.push(botMove);
        await pool.query(`UPDATE "Game" SET "moves"=$1 WHERE "id"=$2`, [game.moves, id]);
        return {...game, message: "Bot has made his move", result: true};
    }
}
function matrix(arr){
    const result = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]
    ]
    for(let i=0; i < arr.length; i++){
        if (arr[i].length == 4){
            const bigBox = arr[i][1];
            const smallBlock = arr[i][3];
            if (i % 2 == 0){
                result[bigBox][smallBlock] = 'X';
            }
            else{
                result[bigBox][smallBlock] = 'O';
            }
        }
        else{
            return {error: "Invalid array"}
        }
    }
    return result
}
function runPythonScript(args) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['bot/bot.py', ...args]);
  
      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python скрипт завершился с кодом ${code}`));
        }
        resolve(output);
      });
  
      pythonProcess.stderr.on('data', (data) => {
        reject(new Error(data));
      });
    });
  }

export default new GameService();
