var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener('load', () => {
    const game = new GameView(document.getElementById('canvas'));
});
class Game {
    constructor(canvas) {
        this.gamestate = GameState.Load;
        this.LevelViews = [];
        this.instructionTexts = [];
        this.fps = 0;
        this.passedFrames = 0;
        this.ticks = 0;
        this.last = 0;
        this.step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.calculateFps();
            switch (this.gamestate) {
                case GameState.Main:
                    this.mainState();
                    break;
                case GameState.Play:
                    this.playState();
                    break;
                case GameState.GameOver:
                    this.overState();
                    break;
                case GameState.GameBeaten:
                    this.winState();
                    break;
                case GameState.Instructions:
                    this.instructionState();
                    break;
                default:
                    this.loader();
            }
            this.passedFrames++;
            requestAnimationFrame(this.step);
        };
        this.keyListener = new KeyboardListener();
        this.initializeCanvas(canvas);
        this.initializeAssets();
        this.loadText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Loading...");
        this.lostText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Jij hebt verloren, druk op R om te herstarten.");
        this.finishedText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Je hebt het hele spel uitgespeeld, gefeliciteerd! Druk op R om het spel opnieuw te starten.");
        this.instructionTexts = this.initializeInstructionText();
        this.step();
    }
    isLoading() {
        return this.LevelViews.length !== Game.AMOUNT_OF_LEVELS;
    }
    initializeLevels() {
        [1, 2, 3].forEach((n) => __awaiter(this, void 0, void 0, function* () {
            const promise = yield fetch(`./assets/json/level${n}.json`);
            const response = yield promise.json();
            response["water"] = [{ xStart: 0, xEnd: window.innerWidth, yStart: window.innerHeight - this.repo.getImage("water").height, yEnd: 1050 }];
            this.LevelViews.push(new LevelView(response, this.ctx, this.repo, this.canvas.width, this.canvas.height));
        }));
    }
    initializeAssets() {
        this.repoKeys = [
            "earth.png.png",
            "level1.png",
            "level2.png",
            "level3.png",
            "tile.png",
            "water.png",
            "coin.png",
            "info.png",
            "enemy.png",
            "winter.png |",
            "lava.jpg |",
            "Forest.jpg |",
            "wintertile.png",
            "lavatile.png",
            "tile.png",
            ...Speaker.SPEAKER_SPRITES
        ].concat(Array(37).fill(null).map((e, i) => `background/${i}.jpg`)).concat(Player.PLAYER_SPRITES.map((sprite) => `player/${sprite}`));
        this.repo = new ImageLoader(this.repoKeys, Game.IMG_PATH);
    }
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    getAllScore() {
        this.menuView.totalScore = this.LevelViews.reduce((a, b) => {
            a += b.score;
            return a;
        }, 0);
    }
    loader() {
        if (!this.repo.isLoading() && this.fps !== 0) {
            if (this.menuView === undefined) {
                this.menuView = new MenuView(this.repo, this.ctx, this.canvas.width, this.canvas.height);
                this.initializeLevels();
            }
            if (this.menuView instanceof MenuView) {
                if (!this.isLoading()) {
                    this.LevelViews.sort((a, b) => Number(a.name.replace(/^\D+/g, '')) - Number(b.name.replace(/^\D+/g, '')));
                    this.gamestate = GameState.Main;
                }
            }
        }
        else {
            this.loadText.drawText(this.ctx);
        }
    }
    mainState() {
        this.getAllScore();
        this.beatTheGame();
        this.menuView.frames = this.passedFrames;
        this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift());
        this.menuView.drawMenu();
        if (this.gamestate === GameState.Main && this.keyListener.isKeyDown(KeyboardListener.KEY_I)) {
            this.gamestate = GameState.Instructions;
        }
        const levelInteracted = this.menuView.interactsWithLevel();
        if (levelInteracted[0]) {
            this.gamestate = GameState.Play;
            this.currentLevelIndex = levelInteracted[1];
        }
    }
    playState() {
        const currentLevel = this.LevelViews[this.currentLevelIndex];
        if (currentLevel.isComplete()) {
            this.gamestate = GameState.Main;
        }
        if (currentLevel.lives !== 0) {
            currentLevel.frames = this.passedFrames;
            currentLevel.drawLevel();
            if (this.keyListener.isKeyDown(KeyboardListener.KEY_ESCAPE)) {
                this.gamestate = GameState.Main;
            }
        }
        else {
            this.gamestate = GameState.GameOver;
        }
    }
    overState() {
        this.lostText.drawText(this.ctx);
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_R)) {
            this.LevelViews.splice(0, this.LevelViews.length);
            this.initializeLevels();
            this.gamestate = GameState.Load;
        }
    }
    beatTheGame() {
        if (this.LevelViews.every((level) => level.isComplete() === true)) {
            this.gamestate = GameState.GameBeaten;
        }
    }
    winState() {
        this.finishedText.drawText(this.ctx);
        this.restart();
    }
    initializeInstructionText() {
        const textStringArr = [];
        const spaceBetween = 50;
        const text = `Druk op enter om te starten.
         Druk op I om het informatie scherm te openen.
         Druk op ESC om uit het informatie scherm te gaan.
         Druk op <- of -> om van level te veranderen in het menu.
         Druk op enter bij een informatie punt of vijand om het dialoogvenster te openen.
         Druk op Q om het dialoogvenster te sluiten.
         Beantwoordt de vragen van de vijand door op A of B te drukken.
         Beweeg het poppetje door middel van de <- of -> toets.
         Laat het poppetje springen door op pijl omhoog toets te drukken.`;
        const textArr = text.split("\n");
        const startHeight = (this.canvas.height / 2) - ((textArr.length / 2) * spaceBetween);
        console.log(startHeight);
        textArr.reduce((a, r) => {
            textStringArr.push(new TextString(this.canvas.width / 2, a, r));
            return a += spaceBetween;
        }, startHeight);
        return textStringArr;
    }
    instructionState() {
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_ESCAPE)) {
            this.gamestate = GameState.Main;
        }
        this.instructionTexts.forEach((text) => text.drawText(this.ctx));
    }
    restart() {
        if (this.gamestate === GameState.GameBeaten && this.keyListener.isKeyDown(KeyboardListener.KEY_R)) {
            location.reload();
        }
    }
    calculateFps() {
        const now = Date.now();
        if (now - this.last >= 1000 && this.fps === 0) {
            this.last = now;
            this.fps = this.ticks;
            window.fps = this.fps;
            this.ticks = 0;
        }
        if (this.fps === 0) {
            this.ticks++;
        }
    }
}
Game.IMG_PATH = "./assets/img/";
Game.AUDIO_PATH = "./assets/audio/";
Game.AMOUNT_OF_LEVELS = 3;
Game.AMOUNT_OF_INFO = 2;
Game.AMOUNT_OF_LIVES = 3;
Game.AMOUNT_OF_ENEMIES = 2;
Game.BASELINE_FPS = 60;
class GameView extends Game {
}
class Logic {
    constructor(repo, width, height) {
        this._frames = 0;
        this._repo = repo;
        this._width = width;
        this._height = height;
        this._cx = this.width / 2;
        this._cy = this.height / 2;
    }
    get cx() {
        return this._cx;
    }
    get cy() {
        return this._cy;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get repo() {
        return this._repo;
    }
    set frames(frame) {
        this._frames = frame;
    }
    get frames() {
        return this._frames;
    }
    animate(ms) {
        const timePerFrameSec = 1000 / window.fps;
        const amountOfFrames = Math.round(ms / timePerFrameSec);
        const statement = this._frames % amountOfFrames === 0;
        return statement;
    }
}
class LevelLogic extends Logic {
    constructor(config, repo, width, height) {
        super(repo, width, height);
        this.currentPlayerImgIndex = { state: 0 };
        this._score = 0;
        this._lives = Game.AMOUNT_OF_LIVES;
        this.blocks = [];
        this.water = [];
        this.coins = [];
        this.spikes = [];
        this.enemies = [];
        this.infoObjects = [];
        this.window = false;
        this.entries = Object.entries(config);
        this.backgroundImage = this.repo.getImage(this.entries.find(e => e[0] === "background")[1]);
        this.tileKey = this.entries.find(e => e[0] === "tile")[1];
        this.initializeEntities();
        this.keyboardListener = new KeyboardListener();
        const playerSprites = Player.PLAYER_SPRITES.map((key) => this.repo.getImage(key));
        this.player = new Player(this.blocks[0].xPos, this.blocks[0].yPos - this.repo.getImage("main_char_1").height, 8, 10, playerSprites);
    }
    initializeEntities() {
        this.initializePlatforms();
        this.initializeCoins();
        this.initializeWater();
        this.initializeInfo();
        this.initializeEnemies();
    }
    initializePlatforms() {
        const tileSprite = this.repo.getImage(this.tileKey);
        this._name = String(this.entries.find((entry) => entry[0] === "name")[1]);
        Object.values(this.entries.find(entry => entry[0] === "platforms")[1]).forEach((settings, i) => {
            const amountOfTiles = Math.floor((settings.xEnd - settings.xStart) / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite));
                settings.xStart += tileSprite.width;
            }
        });
    }
    initializeWater() {
        const waterSprite = this.repo.getImage("water");
        Object.values(this.entries.find(entry => entry[0] === "water")[1]).forEach((settings) => {
            const amountOfWaterTiles = Math.ceil((settings.xEnd - settings.xStart) / waterSprite.width);
            for (let i = 0; i < amountOfWaterTiles; i++) {
                this.water.push(new Water(settings.xStart, settings.yStart, waterSprite));
                settings.xStart += waterSprite.width;
            }
        });
    }
    initializeCoins() {
        const coinSprite = this.repo.getImage("coin");
        this.blocks.forEach((possibleSpawnBlock) => {
            const coin = new Coin(possibleSpawnBlock.xPos, possibleSpawnBlock.yPos - coinSprite.height - 5, coinSprite);
            if (Math.round(Math.random()) === 1 && this.fullCollision(this.blocks, coin)[0] === false) {
                this.coins.push(coin);
            }
        });
    }
    initializeEnemies() {
        const enemySprite = this.repo.getImage("enemy");
        const info = this.entries.find(entry => entry[0] === "questions")[1];
        for (let i = 0; i < Game.AMOUNT_OF_ENEMIES; i++) {
            const randomIndex = Math.floor(Math.random() * this.blocks.length);
            const randomSpawn = this.blocks[randomIndex];
            this.enemies.push(new Enemy(randomSpawn.xPos, randomSpawn.yPos - enemySprite.height, enemySprite, info[i].question, info[i].answer));
        }
    }
    initializeInfo() {
        const infoSprite = this.repo.getImage("info");
        const info = this.entries.find(entry => entry[0] === "questions")[1];
        const tempInfoArr = [];
        for (let i = 0; i < Game.AMOUNT_OF_INFO; i++) {
            const randomIndex = Math.floor(Math.random() * this.blocks.length);
            const randomSpawn = this.blocks[randomIndex];
            const newInfoObj = new InfoObject(randomSpawn.xPos, randomSpawn.yPos - randomSpawn.sprite.height, infoSprite, info[i].question, info[i].answer);
            tempInfoArr.push(newInfoObj);
        }
        const retry = tempInfoArr.map(temp => {
            return this.fullCollision(this.blocks, temp)[0];
        }).find(e => e === true);
        if (retry) {
            this.initializeInfo();
        }
        else {
            tempInfoArr.forEach(infoObj => this.infoObjects.push(infoObj));
        }
    }
    fullCollision(entities, compareEntity) {
        const bools = entities.map((entity, i) => {
            const statement = (entity.xPos <= compareEntity.xPos + compareEntity.sprite.width
                && entity.xPos + entity.sprite.width >= compareEntity.xPos
                && entity.yPos <= compareEntity.yPos + compareEntity.sprite.height
                && entity.yPos + entity.sprite.height >= compareEntity.yPos);
            return [statement, i];
        });
        const result = bools.find(bool => bool[0] === true);
        return result === undefined ? [false, null] : result;
    }
    collidesWithCoin() {
        const coinCollisionResult = this.fullCollision(this.coins, this.player);
        if (coinCollisionResult[0]) {
            const coinIndex = coinCollisionResult[1];
            this._score += this.coins[coinIndex].score;
            this.coins.splice(coinIndex, 1);
        }
    }
    collidesWithTopOfBlock() {
        return this.blocks.map(block => {
            return this.collidesWithSide(this.player, block);
        }).find(side => side === CollisionState.Top) === undefined ? false : true;
    }
    collidesWithLeftRightOrBottom() {
        const side = this.blocks.map(block => {
            return this.collidesWithSide(this.player, block);
        }).find(side => side === CollisionState.Bottom || side === CollisionState.Left || side === CollisionState.Right);
        const boolValue = side === undefined ? true : false;
        return [side, boolValue];
    }
    collidesWithSide(player, entity) {
        const dx = (player.xPos + this.repo.getImage("main_char_1").width / 2) - (entity.xPos + this.repo.getImage("tile").width / 2);
        const dy = (player.yPos + this.repo.getImage("main_char_1").height / 2) - (entity.yPos + this.repo.getImage("tile").height / 2);
        const width = (this.repo.getImage("main_char_1").width + this.repo.getImage("tile").width) / 2;
        const height = (this.repo.getImage("main_char_1").height + this.repo.getImage("tile").height) / 2;
        const crossWidth = width * dy;
        const crossHeight = height * dx;
        let collision = CollisionState.None;
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                collision = (crossWidth > (-crossHeight)) ? CollisionState.Bottom : CollisionState.Left;
            }
            else {
                collision = (crossWidth > -(crossHeight)) ? CollisionState.Right : CollisionState.Top;
            }
        }
        return (collision);
    }
    changePlayerSprite(start, end) {
        if (this.animate(166)) {
            if (this.currentPlayerImgIndex.state !== start) {
                this.currentPlayerImgIndex.state = start;
            }
            else {
                this.currentPlayerImgIndex.state = end;
            }
        }
    }
    hitsBottom() {
        return this.player.yPos + this.repo.getImage("main_char_1").height >= this.height;
    }
    makePlayerJump() {
        const timeIntervalInFrames = window.fps / 2;
        if (this.lastFrameAfterJump === undefined || this.frames > this.lastFrameAfterJump + timeIntervalInFrames) {
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
                this.lastFrameAfterJump = this.frames;
                this.player.jump();
            }
        }
        else if (this.frames < this.lastFrameAfterJump + timeIntervalInFrames / 3) {
            this.player.jump();
        }
    }
    idlePlayer() {
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !(this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT))) {
            this.changePlayerSprite(0, 1);
        }
    }
    makePlayerFall(collidesWithStandableSide) {
        if (!collidesWithStandableSide) {
            if (!this.hitsBottom()) {
                this.player.gravity();
            }
            else {
                this._lives--;
                this.player.xPos = this.blocks[0].xPos + this.repo.getImage("main_char_1").width;
                this.player.yPos = this.blocks[0].yPos - this.repo.getImage("main_char_1").height;
            }
        }
    }
    movePlayerLeft(collidesWithNoneStandableSide) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT)) {
            if (collidesWithNoneStandableSide[0] !== CollisionState.Right) {
                this.player.move(false);
                this.changePlayerSprite(2, 7);
            }
        }
    }
    movePlayerRight(collidesWithNoneStandableSide) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT)) {
            if (collidesWithNoneStandableSide[0] !== CollisionState.Left) {
                this.player.move(true);
                this.changePlayerSprite(8, 13);
            }
        }
    }
    interactsWithInfo() {
        const result = this.fullCollision(this.infoObjects, this.player);
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER) && result[0]) {
            this.window = true;
            return this.infoObjects[result[1]];
        }
        else if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_Q) && this.fullCollision(this.infoObjects, this.player)) {
            this.window = false;
            return this.infoObjects[result[1]];
        }
        return this.infoObjects[result[1]];
    }
    interactsWithEnemy() {
        const result = this.fullCollision(this.enemies, this.player);
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER) && result[0]) {
            this.window = true;
            return this.enemies[result[1]];
        }
        else if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_Q) && this.fullCollision(this.infoObjects, this.player)) {
            this.window = false;
            return this.enemies[result[1]];
        }
        return this.enemies[result[1]];
    }
    answerEnemy(enemy) {
        const a = this.keyboardListener.isKeyDown(KeyboardListener.KEY_A);
        const b = this.keyboardListener.isKeyDown(KeyboardListener.KEY_B);
        if (a || b) {
            const answer = (a && !b) ? "JA" : ((!a && b) ? "NEE" : undefined);
            if (enemy.answer === answer && answer !== undefined) {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.window = false;
            }
            else if (answer !== undefined && enemy.answer !== answer) {
                if (this.window === true) {
                    this._lives--;
                }
                this.window = false;
            }
        }
    }
    get playerImageIndex() {
        return this.currentPlayerImgIndex.state;
    }
    playerActions() {
        const collidesWithStandableSide = this.collidesWithTopOfBlock();
        const collidesWithNoneStandableSide = this.collidesWithLeftRightOrBottom();
        this.collidesWithCoin();
        this.movePlayerRight(collidesWithNoneStandableSide);
        this.movePlayerLeft(collidesWithNoneStandableSide);
        this.makePlayerFall(collidesWithStandableSide);
        this.idlePlayer();
        this.makePlayerJump();
    }
    isComplete() {
        return this.enemies.length === 0;
    }
    get score() {
        return this._score;
    }
    get lives() {
        return this._lives;
    }
    get name() {
        return this._name;
    }
}
class LevelView extends LevelLogic {
    constructor(config, ctx, repo, width, height) {
        super(config, repo, width, height);
        this.ctx = ctx;
        this.scoreText = new TextString(this.width / 10 * 0.5 + this.ctx.measureText("Score 0000").width, this.height / 10 * 1, "Score " + String(0));
        this.lifeText = new TextString(this.width / 10 * 0.5 + this.ctx.measureText("Lives 0000").width, this.height / 10 * 2, "Lives " + String(Game.AMOUNT_OF_LIVES));
    }
    drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.drawCoins();
        this.drawEnemies();
        this.playerActions();
        this.drawPlayer();
        this.drawWater();
        this.drawScore();
        this.drawInfo();
        this.drawInfoScreen();
        this.drawEnemyScreen();
        this.drawLives();
    }
    drawBackGround() {
        this.ctx.drawImage(this.backgroundImage, (this.width / 2) - (this.backgroundImage.width / 2), (this.height / 2) - (this.backgroundImage.height / 2), this.backgroundImage.width, this.backgroundImage.height);
    }
    drawInfo() {
        this.drawEntities(this.infoObjects);
    }
    drawScore() {
        this.scoreText.x;
        this.scoreText.fillStyle = "white";
        this.scoreText.text = "Score " + String(this.score);
        this.scoreText.drawText(this.ctx);
    }
    drawLives() {
        this.lifeText.fillStyle = "white";
        this.lifeText.text = "Lives " + String(this.lives);
        this.lifeText.drawText(this.ctx);
    }
    drawCoins() {
        this.drawEntities(this.coins);
    }
    drawWater() {
        this.drawEntities(this.water);
    }
    drawEnemies() {
        this.drawEntities(this.enemies);
    }
    drawBlocks() {
        this.drawEntities(this.blocks);
    }
    drawEntities(entities) {
        entities.forEach((entity) => {
            entity.draw(this.ctx);
        });
    }
    drawPlayer() {
        this.player.draw(this.ctx, this.playerImageIndex);
    }
    drawInfoScreen() {
        const result = this.interactsWithInfo();
        if (this.window && result !== undefined) {
            const answer = result.answer;
            const question = result.question;
            const questionObj = new TextString(this.cx, this.cy + 50, question);
            const answerObj = new TextString(this.cx, this.cy + 150, answer);
            this.ctx.font = `${questionObj.fontSize}px ${questionObj.font}`;
            const answerWidth = this.ctx.measureText(answer).width;
            const questionWidth = this.ctx.measureText(question).width;
            const width = answerWidth >= questionWidth ? answerWidth : questionWidth;
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(this.cx - width, this.cy, width * 2, 200);
            questionObj.drawText(this.ctx);
            answerObj.drawText(this.ctx);
        }
    }
    drawEnemyScreen() {
        const result = this.interactsWithEnemy();
        if (this.window && result !== undefined) {
            const question = result.question;
            const questionObj = new TextString(this.cx, this.cy + 50, question);
            this.ctx.font = `${questionObj.fontSize}px ${questionObj.font}`;
            const questionWidth = this.ctx.measureText(question).width;
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(this.cx - questionWidth, this.cy, questionWidth * 2, 200);
            ["JA", "NEE"].reduce((a, r) => {
                new TextString(this.cx, this.cy + a, r).drawText(this.ctx);
                a += 50;
                return a;
            }, 100);
            this.answerEnemy(result);
            questionObj.drawText(this.ctx);
        }
    }
}
class MenuLogic extends Logic {
    constructor(width, height, repo) {
        super(repo, width, height);
        this.canJump = { right: true, left: true };
        this.currentPlayerImgIndex = { state: 0 };
        this.menuItems = [];
        this.speakers = [];
        this.audio = true;
        this._totalScore = 0;
        this.backgroundAudio = new Audio(MenuLogic.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.backgroundFrame = { frame: this.repo.getImage("0"), key: "0" };
        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        const playerSprites = Player.PLAYER_SPRITES.map((key) => this.repo.getImage(key));
        this.player = new Player(this.width / 3, 0, 0, 0, playerSprites);
    }
    initializeImages() {
        this.speakers = [...Speaker.SPEAKER_SPRITES].map((key) => {
            const image = this.repo.getImage(key);
            return new Speaker(0, 0, 0, image);
        });
        this.menuItems = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            const image = this.repo.getImage(`level${i + 1}`);
            const x = this.width / 3 + (image.width * 2) * i;
            const instance = new MenuItem(x, this.height / 10 * 2.5, image);
            return instance;
        });
    }
    backGroundAudio() {
        if (this.audio) {
            this.backgroundAudio.play();
        }
        else {
            this.backgroundAudio.pause();
            this.backgroundAudio.currentTime = 0;
        }
    }
    movePlayer() {
        const maxBound = this.menuItems[this.menuItems.length - 1].xPos;
        const minBound = this.menuItems[0].xPos;
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJump.right && this.player.xPos <= maxBound) {
            this.canJump.right = false;
            const nextXPos = this.player.xPos + (this.repo.getImage("level1").width * 2);
            if (nextXPos <= maxBound) {
                this.player.xPos = nextXPos;
            }
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJump.left && this.player.xPos >= minBound) {
            this.canJump.left = false;
            const nextXPos = this.player.xPos - this.repo.getImage("level1").width * 2;
            if (nextXPos >= minBound) {
                this.player.xPos = nextXPos;
            }
        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !this.canJump.left) {
            this.canJump.left = true;
        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJump.right) {
            this.canJump.right = true;
        }
    }
    changeSprite() {
        if (this.animate(250)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            }
            else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        return next;
    }
    changeBackground() {
        if (this.animate(50)) {
            this.backgroundFrame.key = String(Number(this.backgroundFrame.key) + 1);
            if (Number(this.backgroundFrame.key) >= MenuLogic.AMOUNT_OF_FRAMES) {
                this.backgroundFrame.key = String(0);
            }
            this.backgroundFrame.frame = this.repo.getImage(this.backgroundFrame.key);
        }
        return this.backgroundFrame.frame;
    }
    mute() {
        window.addEventListener("click", event => {
            const referenceImg = this.repo.getImage("muted");
            if (event.clientX >= 0 &&
                event.clientX < 0 + referenceImg.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + referenceImg.height) {
                this.audio = (this.audio === true ? false : true);
            }
        });
    }
    interactsWithLevel() {
        let returnValue = [false, null];
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER)) {
            this.menuItems.forEach((menuItem, i) => {
                const currentPlayerSprite = this.repo.getImage(`main_char_${this.currentPlayerImgIndex.state + 1}`);
                const playerPos = this.player.xPos + currentPlayerSprite.width;
                if (playerPos >= menuItem.xPos && playerPos <= menuItem.xPos + this.repo.getImage("level1").width) {
                    returnValue = [true, i];
                }
            });
        }
        return returnValue;
    }
    set totalScore(score) {
        this._totalScore = score;
    }
}
MenuLogic.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
MenuLogic.AMOUNT_OF_FRAMES = 37;
class MenuView extends MenuLogic {
    constructor(repo, ctx, width, height) {
        super(width, height, repo);
        this.ctx = ctx;
        this.totalScoreText = new TextString(this.width - this.ctx.measureText("0000").width, 100, String(0));
    }
    drawTotalScore() {
        this.totalScoreText.fillStyle = "white";
        this.totalScoreText.text = String(this._totalScore);
        this.totalScoreText.drawText(this.ctx);
    }
    drawInstructions() {
        const instructionText = "DRUK OP ENTER OM TE STARTEN | DRUK OP I VOOR DE GEBRUIKSHANDLEIDING";
        const instructions = new TextString(this.width / 2, this.height / 2 + this.repo.getImage("earth").height, instructionText);
        instructions.fillStyle = "white";
        instructions.drawText(this.ctx);
    }
    drawPlayer() {
        const next = this.changeSprite();
        const levelObjHeight = this.repo.getImage("level1").height;
        const playerPos = this.height / 10 * 2.3 + levelObjHeight;
        this.player.yPos = playerPos - this.repo.getImage(`main_char_${next + 1}`).height;
        this.player.draw(this.ctx, next);
    }
    drawMenuItems() {
        this.menuItems.forEach(menuItem => {
            menuItem.draw(this.ctx);
        });
    }
    drawSpeaker() {
        const speakerSpriteIndex = this.audio ? 0 : 1;
        this.speakers[speakerSpriteIndex].draw(this.ctx);
    }
    drawBackGround() {
        const background = this.repo.getImage("earth");
        background.width = 300;
        background.height = 300;
        this.ctx.drawImage(this.changeBackground(), 0, 0, this.width, this.height);
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }
    drawMenu() {
        this.mute();
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        this.drawInstructions();
        this.drawTotalScore();
    }
}
class GameEntity {
    constructor(x, y, velocityX = 0, velocityY = 0) {
        this._xPos = x;
        this._yPos = y;
        [this._velocityX, this._velocityY] = this.calculateVelocity(velocityX, velocityY);
    }
    calculateVelocity(velocityX, velocityY) {
        const diff = window.fps / Game.BASELINE_FPS;
        const xVel = Math.round(velocityX / diff);
        const yVel = Math.round(velocityY / diff);
        return [xVel, yVel];
    }
    get velocityX() {
        return this._velocityX;
    }
    set velocityX(velocity) {
        this._velocityX = velocity;
    }
    get velocityY() {
        return this._velocityY;
    }
    set velocityY(velocity) {
        this._velocityY = velocity;
    }
    get yPos() {
        return this._yPos;
    }
    get xPos() {
        return this._xPos;
    }
    set yPos(y) {
        this._yPos = y;
    }
    set xPos(x) {
        this._xPos = x;
    }
}
class Block extends GameEntity {
    constructor(x, y, img) {
        super(x, y);
        this.img = img;
    }
    get sprite() {
        return this.img;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
class Coin extends GameEntity {
    constructor(x, y, sprite) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._score = Coin.SCORE;
    }
    get sprite() {
        return this.img;
    }
    get score() {
        return this._score;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
Coin.SCORE = 10;
class Enemy extends GameEntity {
    constructor(x, y, sprite, question, answer) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._question = question;
        this._answer = answer;
    }
    get sprite() {
        return this.img;
    }
    get question() {
        return this._question;
    }
    get answer() {
        return this._answer;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
class InfoObject extends GameEntity {
    constructor(x, y, sprite, question, answer) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._question = question;
        this._answer = answer;
    }
    get sprite() {
        return this.img;
    }
    get answer() {
        return this._answer;
    }
    get question() {
        return this._question;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
class MenuItem extends GameEntity {
    constructor(x, y, img) {
        super(x, y);
        this.image = img;
    }
    get sprite() {
        return this.image;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.xPos, this.yPos);
    }
}
class Player extends GameEntity {
    constructor(x, y, velocityX, velocityY, sprites) {
        super(x, y, velocityX, velocityY);
        this.images = sprites;
    }
    move(direction) {
        const nextXPos = this.xPos + (direction ? this.velocityX : -this.velocityX);
        this.xPos = nextXPos;
    }
    jump() {
        this.yPos -= this.velocityY;
    }
    gravity() {
        this.yPos += this.velocityY / 2;
    }
    get sprites() {
        return this.images;
    }
    get sprite() {
        return this.images[0];
    }
    draw(ctx, state) {
        ctx.drawImage(this.images[state], this.xPos, this.yPos);
    }
}
Player.PLAYER_SPRITES = [`main_char_1.png`, `main_char_2.png`, `run-left1.png`, `run-left2.png`, `run-left3.png`, `run-left4.png`, `run-left5.png`, `run-left6.png`,
    `run-right1.png`, `run-right2.png`, `run-right3.png`, `run-right4.png`, `run-right5.png`, `run-right6.png`];
class Speaker extends GameEntity {
    constructor(x, y, velocity, img) {
        super(x, y, velocity);
        this.image = img;
    }
    get sprite() {
        return this.image;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.xPos, this.yPos);
    }
}
Speaker.SPEAKER_SPRITES = ["not-muted.png", "muted.png"];
class Spike extends GameEntity {
    constructor(x, y, sprite) {
        super(x, y, 0, 0);
        this.img = sprite;
    }
    get sprite() {
        return this.img;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
Spike.SPRITE = [""];
class Water extends GameEntity {
    constructor(x, y, sprite) {
        super(x, y, 0, 0);
        this.img = sprite;
    }
    get sprite() {
        return this.img;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
Water.SPRITE = [""];
class Calculate {
    static calculateWidthMultiplier() {
        return (1 - Math.abs((window.innerWidth - Calculate.BASELINE_WIDTH) / Calculate.BASELINE_WIDTH));
    }
    static calculateHeightMultiplier() {
        return (1 - Math.abs((window.innerHeight - Calculate.BASELINE_HEIGHT) / Calculate.BASELINE_HEIGHT));
    }
}
Calculate.BASELINE_WIDTH = 1920;
Calculate.BASELINE_HEIGHT = 969;
class ImageLoader {
    constructor(assets, prefix) {
        this.images = [];
        this.loadingAssets = [];
        assets.forEach((name) => {
            const path = prefix + name;
            this.loadImage(path);
        });
    }
    loadImage(path) {
        const image = new Image();
        const key = (path.includes("|") ? path.split(" |").shift() : path).split("/").pop().split(".").shift();
        image.addEventListener("load", () => {
            if (!path.includes("|") && Calculate.BASELINE_WIDTH !== window.innerWidth && Calculate.BASELINE_HEIGHT !== window.innerHeight) {
                image.width = image.width * Calculate.calculateWidthMultiplier();
                image.height = image.height * Calculate.calculateHeightMultiplier();
            }
            this.images.push({ key: key, image: image });
            this.loadingAssets.splice(this.loadingAssets.indexOf(key), 1);
        });
        this.loadingAssets.push(key);
        image.src = (path.includes("|") ? path.split(" |").shift() : path);
    }
    isLoading() {
        return this.loadingAssets.length > 0;
    }
    getImage(key) {
        const image = this.images.find((e) => e.key === key.split(".").shift());
        return image !== undefined ? image.image : null;
    }
}
class KeyboardListener {
    constructor() {
        this.keyDown = (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        };
        this.keyUp = (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        };
        this.keyCodeStates = new Array();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] === true;
    }
}
KeyboardListener.KEY_SPACE = 32;
KeyboardListener.KEY_LEFT = 37;
KeyboardListener.KEY_UP = 38;
KeyboardListener.KEY_RIGHT = 39;
KeyboardListener.KEY_DOWN = 40;
KeyboardListener.KEY_ENTER = 13;
KeyboardListener.KEY_ESCAPE = 27;
KeyboardListener.KEY_Q = 81;
KeyboardListener.KEY_R = 82;
KeyboardListener.KEY_A = 65;
KeyboardListener.KEY_B = 66;
KeyboardListener.KEY_I = 73;
class RandomNumber {
    static randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
class TextString {
    constructor(x, y, text) {
        this.font = "Edmunds";
        this.fontSize = 30;
        this.fillStyle = "black";
        this.textAlign = "center";
        this.textBaseline = "alphabetic";
        this.x = x;
        this.y = y;
        this.text = text;
    }
    drawText(ctx) {
        ctx.save();
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.fillStyle;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
var CollisionState;
(function (CollisionState) {
    CollisionState[CollisionState["Top"] = 0] = "Top";
    CollisionState[CollisionState["Bottom"] = 1] = "Bottom";
    CollisionState[CollisionState["Left"] = 2] = "Left";
    CollisionState[CollisionState["Right"] = 3] = "Right";
    CollisionState[CollisionState["None"] = 4] = "None";
})(CollisionState || (CollisionState = {}));
var GameState;
(function (GameState) {
    GameState[GameState["Load"] = 0] = "Load";
    GameState[GameState["Main"] = 1] = "Main";
    GameState[GameState["Play"] = 2] = "Play";
    GameState[GameState["GameOver"] = 3] = "GameOver";
    GameState[GameState["GameBeaten"] = 4] = "GameBeaten";
    GameState[GameState["Instructions"] = 5] = "Instructions";
})(GameState || (GameState = {}));
//# sourceMappingURL=app.js.map