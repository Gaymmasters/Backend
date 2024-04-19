class Game {
    constructor(data){
        this.id = data.id;
        this.player1Id = data.player1Id;
        this.player2Id = data.player2Id;
        this.winFlag = data.winFlag;
        this.password = data.password;
        this.moves = data.moves;
        this.name = data.name;
        this.isPrivate = data.isPrivate;
    }
}
export default Game;