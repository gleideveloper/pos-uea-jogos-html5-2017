"use strict"; 

var WinState = function(game) {};

WinState.prototype.preload = function() {
}

WinState.prototype.create = function() {
    this.game.add.text(100,100,"you lose", {fill:"#FFFFFF"})

}

WinState.prototype.update = function() {

}
