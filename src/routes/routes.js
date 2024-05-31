import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import gameController from "../controllers/game.controller.js";

const router = new Router();

//user routes
router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 20}),
    body('login').isLength({min: 5, max: 20}),
    userController.registerUser);
router.post('/login',
    body('email').isEmail(),
    userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user/login/:id',
           body('login').isLength({min: 5, max: 20}),
           userController.updateLogin);
router.put('/user/skin/:id', userController.updateSkin);
router.delete('/user/:id', userController.deleteUser);

//game routes
router.get('/game', gameController.getAllGames);
router.get('/game/active', gameController.getActiveGame);
router.get('/game/:id', gameController.getOneGame);
router.post('/create',
            body('player1Id').exists().not().isEmpty(),
            gameController.createGame);
router.delete('/game/:id', gameController.deleteGame);
router.put('/join', gameController.joinGame);
router.get('/moves/:id', gameController.getMoves);
router.post('/makemove', gameController.makeMove);
router.post('/botmove', gameController.botMove);
router.put('/flagwinner', gameController.flagWinner);

export default router;
