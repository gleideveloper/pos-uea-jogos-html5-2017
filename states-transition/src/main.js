/**
 * Created by gleidesilva on 22/05/17.
 */

var game = new Phaser.Game(320, 480, Phaser.CANVAS, "game");
game.state.add("Boot", boot);
game.state.add("Preload", preload);
game.state.add("GameTitle", gameTitle);
game.state.add("TheGame", theGame);
game.state.add("GameOver", gameOver);
game.state.start("Boot");
