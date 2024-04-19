import pool from "../db/database.js";
import gameService from "../services/game.service.js";

class GameController {
    async getAllGames(req, res){
        try{
            const games = await pool.query(`SELECT * FROM "Game"`);
            console.log(games.rows);
            return res.json(games.rows)
        }catch(e){
            console.log(e);
            return res.status(400).json({message: "Some get error", result: false})
        }
    }
    async getOneGame(req, res){
        try{
            const id = req.params.id;
            const gameData = await gameService.getOneGame(id);
            console.log(gameData);
            return res.json(gameData)
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get error", result: false})
        }
    }
    async createGame(req, res){
        try{
            const id = Date.now();
            const {name, isPrivate, password, player1Id} = req.body;
            const gameData = await gameService.createGame(id, name, isPrivate, password, player1Id);
            console.log(gameData);
            return res.json(gameData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some game creation error", result: false})
        }
    }
    async joinGame(req, res){
        try{
            const {name, password, player2Id} = req.body;
            const gameData = await gameService.joinGame(player2Id, name, password);
            console.log(gameData);
            return res.json(gameData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some game join error", result: false});
        }
    }
    async getMoves(req, res){
        try{
            const id = req.params.id;
            const gameData = await gameService.getMoves(id);
            console.log(gameData);
            return res.json(gameData)
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some get moves error", result: false});
        }
    }
    async makeMove(req, res){
        try{
            const {id, move} = req.body;
            const userData = await gameService.makeMove(id, move);
            console.log(userData);
            return res.json(userData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some movement error", result: false})
        }
    }
    async flagWinner(req, res){
        try{
            const {id, winFlag} = req.body;
            const gameData = await gameService.flagWinner(id, winFlag);
            console.log(gameData);
            return res.json(gameData);
        }catch(e){
            console.error(e);
            return res.status(400).json({message: "Some flag winner error", result: false});
        }
    }
}
export default new GameController();