"use strict"; 

var LoseState = function(game) {};

LoseState.prototype.preload = function() {
}

LoseState.prototype.create = function() {
    this.game.add.text(100,100,"you lose", {fill:"#FFFFFF"})

}

LoseState.prototype.update = function() {

}
