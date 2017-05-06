"use strict"; 

var GameState = function(game) {};

GameState.prototype.preload = function()
{
    this.game.load.image('player', 'Assets/player.png');
    this.game.load.image('platform', 'Assets/wallHorizontal.png')
    this.game.load.image('coin', 'Assets/coin.png')
    this.game.load.audio('jumpSound', 'Assets/jump.ogg')
    this.game.load.audio('coinSound', 'Assets/coin.ogg')
}

GameState.prototype.create = function()
{
    this.game.physics.startSystem(Phaser.Physics.ARCADE);    
    
    //criando som
    this.jumpSound = this.game.add.audio('jumpSound');
    this.coinSound = this.game.add.audio('coinSound');
    
    //criando main player
    this.player = this.game.add.sprite(400, 300, 'player');
    this.player.anchor.setTo(0.5,0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    
    //criando moedas
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.coins.create(400,200,'coin');
    this.coins.create(300,350,'coin');
    this.coins.create(100,250,'coin');
    
    
//    this.platform = this.game.add.sprite(300, 500, 'platform');
//    this.game.physics.enable(this.platform);
//    this.platform.body.immovable = true;
//    
//    this.platform2 = this.game.add.sprite(100, 400, 'platform');
//    this.game.physics.enable(this.platform2);
//    this.platform2.body.immovable = true;
//    
//    this.platform3 = this.game.add.sprite(300, 100, 'platform');
//    this.game.physics.enable(this.platform3);
//    this.platform3.body.immovable = true;
    
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.platforms.create(300, 500, 'platform');
    this.platforms.create(300, 300, 'platform');
    //this.platforms = this.game.add.sprite(100, 400, 'platform');    
    //Plataforma móvel
    this.movingPlatform = this.platforms.create(100,400,'platform');
    this.platforms.setAll('body.immovable', true);
    
    this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //add key input to variable
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    this.movingPlatform.body.velocity.x = -100;
    
    //estado do jogox
    this.coinCount = 3;
    console.debug("Coins: " + this.coinCount);
    
}

GameState.prototype.update = function()
{
    //Colisões
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.player, this.coins, this.coinCollision, null, this);
    
    
    //this.game.physics.arcade.collide(this.player, this.platform);   
    
    if(this.jump.isDown && this.player.body.touching.down)
    {
        this.player.body.velocity.y = -450;
        
        this.jumpSound.play();
    }
    
    if(this.left.isDown)
    {
        this.player.body.velocity.x = -200;    
    }    
    else if(this.right.isDown)
    {
        this.player.body.velocity.x = 200;    
    }
    else
    {
        this.player.body.velocity.x = 0;
    }
    
    //Plataforma móvel  
    if(this.movingPlatform.x<50)
        this.movingPlatform.body.velocity.x = +100;
    else if (this.movingPlatform.x>500)
        this.movingPlatform.body.velocity.x = -100;
    
    //Condicao de vitoria
    if(this.coinCount == 0){
        this.game.state.start('win');
        console.debug("You Win")
    }
    
    //Condicao de derrota
    if(this.player.y > 600){
        this.game.state.start('lose');
        console.debug("You Lose")
    }
}

GameState.prototype.coinCollision = function(player, coin){
    this.coinSound.play();
    this.coinCount--;
    console.debug("CoinCount: " + this.coinCount)
    coin.kill();
}