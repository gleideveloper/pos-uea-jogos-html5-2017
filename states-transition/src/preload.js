var preload = function(game){}

/*preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(160,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		this.game.load.spritesheet("numbers","assets/numbers.png",100,100);
		this.game.load.image("gametitle","assets/gametitle.png");
		this.game.load.image("play","assets/play.png");
		this.game.load.image("higher","assets/higher.png");
		this.game.load.image("lower","assets/lower.png");
		this.game.load.image("gameover","assets/gameover.png");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}*/

preload.prototype.preload = function(){
        this.loadingBar = this.add.sprite(160,240,"loading");
    	this.loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(this.loadingBar);
        this.game.load.spritesheet("numbers","assets/numbers.png",100,100);
        this.game.load.image("gametitle","assets/gametitle.png");
        this.game.load.image("play","assets/play.png");
        this.game.load.image("higher","assets/higher.png");
        this.game.load.image("lower","assets/lower.png");
        this.game.load.image("gameover","assets/gameover.png");

}

preload.prototype.create = function(){
    game.time.events.add(5000, fadePicture, this);
    //this.game.state.start("GameTitle");
}

function fadePicture() {
    //game.add.tween(this.loadingBar).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    this.game.state.start("GameTitle");
}