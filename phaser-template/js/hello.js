"use strict"; 

var NewState = function(game) {};

NewState.prototype.preload = function() {
}

NewState.prototype.create = function() {
    this.game.add.text(100,100,"Hello Phaser", {fill:"#FFFFFF"})

}

NewState.prototype.update = function() {

}
