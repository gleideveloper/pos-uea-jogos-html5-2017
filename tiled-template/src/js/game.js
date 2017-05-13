"use strict";

var GameState = function (game) {
};

GameState.prototype.preload = function () {
    this.game.load.spritesheet('player', 'assets/spritesheets/player.png', 32, 32, 8);
    this.game.load.image('mapTiles', 'assets/spritesheets/tiles.png');
    this.game.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
}

GameState.prototype.create = function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.level1 = this.game.add.tilemap('level1');
    this.level1.addTilesetImage('tiles', 'mapTiles');
    this.bgLayer = this.level1.createLayer('Bg');
    this.wallsLayer = this.level1.createLayer('Walls');
    this.wallsLayer.resizeWorld();

    //Define qual tiles nao serao colididos
    this.level1.setCollisionByExclusion([9, 10, 11, 12, 17, 18, 19, 20], true, this.wallsLayer);

    // Player
    // Inicializando jogador  
    this.player = this.game.add.sprite(160, 64, 'player', 5);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    this.keys = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

GameState.prototype.update = function () {

    //define quais tiles serao colididos
    this.game.physics.arcade.collide(this.player, this.wallsLayer);

    if (this.keys.left.isDown) {
        this.player.body.velocity.x = -150; // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == 1) this.player.scale.x = -1;
    }
    // Se a tecla direita estiver pressionada (this.keys.right.isDown == true),
    // mover o sprite para a direita
    else if (this.keys.right.isDown) {
        // se a tecla direita estiver pressionada
        this.player.body.velocity.x = 150;  // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == -1) this.player.scale.x = 1;
    }
    else {
        // Se nenhuma tecla estiver sendo pressionada:
        // Ajustar velocidade para zero
        this.player.body.velocity.x = 0;
        // Executar animação 'idle'
    }

    // Se o a barra de espaço ou a tecla cima estiverem pressionadas, e o jogador estiver com a parte de baixo tocando em alguma coisa
    if ((this.jumpButton.isDown || this.keys.up.isDown) && (this.player.body.touching.down || this.player.body.onFloor())) {
        // Adicione uma velocidade no eixo Y, fazendo o jogador pular
        this.player.body.velocity.y = -400;
    }
}
