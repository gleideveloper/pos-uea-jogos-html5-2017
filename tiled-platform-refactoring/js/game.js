"use strict";

var GameState = function (game) {
}

GameState.prototype.preload = function () {
    //Carrega o arquivo Tiled no formato JSON
    this.game.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);

    //Carrega o tiles do spritesheets
    this.game.load.image('mapTiles', 'assets/spritesheets/tiles.png');

    // Carrega um spritesheet, os sprites são de 32x32(wxh) pixels, e há 8 sprites no arquivo
    this.game.load.spritesheet('player', 'assets/spritesheets/player.png', 32, 32, 8);
    this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
    this.game.load.spritesheet('enemies', 'assets/spritesheets/enemies.png', 32, 32, 12);

    //Carrega a particula do efeito do diamante
    this.game.load.image('particle', 'assets/spritesheets/pixel.png');

    // Carregas os sons
    this.game.load.audio('jumpSound', 'assets/sounds/jump.wav');
    this.game.load.audio('pickupSound', 'assets/sounds/pickup.wav');
    this.game.load.audio('playerDeathSound', 'assets/sounds/hurt3.ogg');
    this.game.load.audio('enemyDeathSound', 'assets/sounds/hit2.ogg');
    this.game.load.audio('music', 'assets/sounds/mystery.wav');
}

GameState.prototype.create = function () {
    // Inicializando sistema de física
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.createMapLevel1();

    this.createPlayer();

    this.createCoin();

    this.createEnemy();

    this.createControlKey();

    this.createSound();

    this.createScore();
}

GameState.prototype.update = function () {
    //Seta colisão dos objetos
    this.setCollide();

    // Movimentação do player
    this.playerMovements();
}

GameState.prototype.setCollide = function () {
    // Detecção de colisões do player com as paredes da fase, que é um layer
    this.game.physics.arcade.collide(this.player, this.wallsLayer);

    // Cada colisão entre dois objetos terá um callback, que é o terceiro parâmetro
    // Colisão com os diamantes - devem ser coletados
    this.game.physics.arcade.overlap(this.player, this.diamonds, this.itemCollect, null, this);

    // O jogador morre na colisão com a lava ou com os morcegos
    this.game.physics.arcade.collide(this.player, this.lavaLayer, this.lavaCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.bats, this.enemieCollision, null, this);

    // Adicionando colisão entre os morcegos e as paredes
    this.game.physics.arcade.collide(this.bats, this.wallsLayer);
}

GameState.prototype.itemCollect = function(player, diamond){
    // Atualizando estado do jogo e HUD
    this.collectedDiamonds++;
    this.score += 100;
    this.scoreText.text = "Score: " + this.score;
    // Condição de vitória: pegar todos os diamantes
    if(this.collectedDiamonds == this.totalDiamonds){
        Globals.score = this.score; // Guardando score na variável global para o próximo estado
        this.music.stop();
        this.game.state.start('win');
    }
    //Define o ponto de colisão
    this.particleEmitter.x = diamond.x;
    this.particleEmitter.y = diamond.y;
    //Emite o efeito de particula
    this.particleEmitter.start(true, 500, null, 10);

    this.pickupSound.play(); // som de pegar o diamante
    diamond.kill(); // removendo o diamante do jogo
}

GameState.prototype.enemieCollision = function(player, bat){
    // Tratamento da colisão entre o jogador e os diamantes
    // Se o jogador colidir por baixo e o morcego por cima, isso indica que o jogador pulou
    // em cima do morcego, nesse caso vamos "matar" o morcego
    if(player.body.touching.down && bat.body.touching.up){
        // tocando som de morte do morcego
        this.enemyDeathSound.play();
        // adicionando um pequeno impulso vertical ao jogador
        this.player.body.velocity.y = -200;
        // atualizando score
        this.score += 200;
        this.scoreText.text = "Score: " + this.score;
        bat.kill();
    }
    else this.lose(); // caso contrário, ir para condição de derrota
}

// Nesse caso, apenas desligamos a colisão com a lava para evitar chamar o evento
// repetidas vezes, e vamos para a condição de derrota
GameState.prototype.lavaCollision = function(){
    this.level1.setCollision([5, 6, 13], false, this.lavaLayer);
    this.music.stop();
    this.lose();
}

// Condição de derrota: guarde o score e siga para o próximo estado
GameState.prototype.lose = function(){
    console.debug("Morreu!");
    Globals.score = this.score;
    this.playerDeathSound.play();
    this.music.stop();
    this.game.state.start('lose');
}

GameState.prototype.createCoin = function () {
// Grupo de diamantes
    this.diamonds = this.game.add.physicsGroup();
    this.level1.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
    // Para cada objeto do grupo, vamos executar uma função
    this.diamonds.forEach(function (diamond) {
        // body.immovable = true indica que o objeto não é afetado por forças externas
        diamond.body.immovable = true;
        // Adicionando animações; o parâmetro true indica que a animação é em loop
        diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
        diamond.animations.play('spin');
    });

    //Emissor de particulas
    this.particleEmitter = this.game.add.emitter(0,0,100);
    this.particleEmitter.makeParticles ('particle');
}

GameState.prototype.createEnemy = function () {
    // Grupo de morcegos:
    this.bats = this.game.add.physicsGroup();
    this.level1.createFromObjects('Enemies', 'bat', 'enemies', 8, true, false, this.bats);
    this.bats.forEach(function (bat) {
        bat.anchor.setTo(0.5, 0.5);
        bat.body.immovable = true;
        bat.animations.add('fly', [8, 9, 10], 6, true);
        bat.animations.play('fly');
        // Velocidade inicial do inimigo
        bat.body.velocity.x = 100;
        // bounce.x=1 indica que, se o objeto tocar num objeto no eixo x, a força deverá
        // ficar no sentido contrário; em outras palavras, o objeto é perfeitamente elástico
        bat.body.bounce.x = 1;
    });
}

GameState.prototype.createScore = function () {
    // HUD de score
    this.scoreText = this.game.add.text(10, 5, "Score: 0", {font: "25px Arial", fill: "#ffffff"});

    // Score fixo na câmera
    this.scoreText.fixedToCamera = true;

    // Estado do jogo - Variáveis para guardar quaisquer informações pertinentes para as condições de
    // vitória/derrota, ações do jogador, etc
    this.totalDiamonds = this.diamonds.length;
    this.collectedDiamonds = 0;
    this.score = 0;
};

GameState.prototype.createSound = function(){
    // Criando assets de som
    this.jumpSound = this.game.add.audio('jumpSound');
    this.pickupSound = this.game.add.audio('pickupSound');
    this.playerDeathSound = this.game.add.audio('playerDeathSound');
    this.enemyDeathSound = this.game.add.audio('enemyDeathSound');
    // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    // Já iniciamos a música aqui mesmo pra ficar tocando ao fundo
    this.music.play();
}

GameState.prototype.createControlKey = function () {
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

GameState.prototype.createMapLevel1 = function () {
    //Cria o mapa e os layers do Tiled no Phaser
    this.level1 = this.game.add.tilemap('level1');
    this.level1.addTilesetImage('tiles', 'mapTiles');

    //Cria os layers
    this.bgLayer = this.level1.createLayer('Bg');
    this.wallsLayer = this.level1.createLayer('Walls');
    this.lavaLayer = this.level1.createLayer('Lava');

    //Define quais tiles do layer walls NÃO terão colisões
    this.level1.setCollisionByExclusion([9, 10, 11, 12, 17, 18, 19, 20], true, this.wallsLayer);

    // Define quais tiles do layer de lava colidem, então é mais fácil
    this.level1.setCollision([5, 6, 13], true, this.lavaLayer);

    // Redimensionando o tamanho do "mundo" do jogo
    this.wallsLayer.resizeWorld();
}

GameState.prototype.createPlayer = function () {
    // cria o jogador adicionando-o na posição (160, 64) usando posição 5 do vetor
    this.player = this.game.add.sprite(160, 64, 'player', 5);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);
    // Animações do jogador com os parâmetros: nome da animação, lista de quadros e número de FPS
    this.player.animations.add('walk', [0, 1, 2, 1], 6);
    this.player.animations.add('idle', [5, 5, 5, 5, 5, 5, 6, 5, 6, 5], 6);
    this.player.animations.add('jump', [4], 6);
}

GameState.prototype.playerMovements = function () {
    // Caso seja a tecla para a esquerda, ajustar uma velocidade negativa
    // ao eixo X, que fará a posição X diminuir e consequentemente o jogador
    // ir para a esquerda;
    if (this.keys.left.isDown) {
        this.player.body.velocity.x = -150; // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == 1)
            this.player.scale.x = -1;
        // Iniciando a animação 'walk'
        this.player.animations.play('walk');
    }
    // Se a tecla direita estiver pressionada (this.keys.right.isDown == true),
    // mover o sprite para a direita
    else if (this.keys.right.isDown) {
        // se a tecla direita estiver pressionada
        this.player.body.velocity.x = 150;  // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == -1)
            this.player.scale.x = 1;
        // Iniciando a animação 'walk'
        this.player.animations.play('walk');
    }
    else {
        // Se nenhuma tecla estiver sendo pressionada:
        // Ajustar velocidade para zero
        this.player.body.velocity.x = 0;
        // Executar animação 'idle'
        this.player.animations.play('idle');
    }

    // Se o a barra de espaço ou a tecla cima estiverem pressionadas, e o jogador estiver com a parte de baixo tocando em alguma coisa
    if((this.jumpButton.isDown || this.keys.up.isDown) && (this.player.body.touching.down || this.player.body.onFloor())){
        // Adicione uma velocidade no eixo Y, fazendo o jogador pular
        this.player.body.velocity.y = -400;
        // Tocando o som de pulo
        this.jumpSound.play();
    }

    // Se o jogador não estiver no chão, inicie a animação 'jump'
    if(!this.player.body.touching.down && !this.player.body.onFloor()){
        this.player.animations.play('jump');
    }

    // Para cada morcego, verificar em que sentido ele está indo
    // Se a velocidade for positiva, a escala no eixo X será 1, caso
    // contrário -1
    this.bats.forEach(function(bat){
        if(bat.body.velocity.x != 0) {
            // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
            bat.scale.x = 1 * Math.sign(bat.body.velocity.x);
        }
    });
}


