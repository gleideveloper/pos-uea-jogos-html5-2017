"use strict"; 

var GameState = function(game) {};

GameState.prototype.preload = function() {
    this.game.load.image('logo', 'Assets/phaserlogo.png');
}

GameState.prototype.create = function() {
    this.logo = this.game.add.sprite(400, 300, 'logo');
    this.logo.anchor.setTo(0.5,0.5);
    console.debug("Hello world");
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

GameState.prototype.update = function() {
    this.logo.angle += 1;
    
    if(this.spaceBar.isDown){
        this.game.state.start('hello');
    }
}
