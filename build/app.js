window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'));
});
class Game {
    constructor(canvas) {
        this.gamestate = GameState.Load;
        this.LevelViews = [];
        this.fps = 0;
        this.passedFrames = 0;
        this.ticks = 0;
        this.last = 0;
        this.step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            switch (this.gamestate) {
                case GameState.Main:
                    this.mainState();
                    break;
                case GameState.Play:
                    this.playState();
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
        this.step();
    }
    initializeLevels() {
        for (let i = 0; i < Game.AMOUNT_OF_LEVELS; i++) {
            const config = {
                name: `level ${i + 1}`,
                platforms: [
                    { xStart: 0, xEnd: 500, yStart: 100, yEnd: 200 },
                    { xStart: 0, xEnd: 100, yStart: 200, yEnd: 200 }
                ],
                spikes: [{ xStart: 0, xEnd: 500, yStart: 100, yEnd: 200 }]
            };
            this.LevelViews.push(new View(config, this.ctx, this.repo, this.canvas.width, this.canvas.height));
        }
    }
    initializeAssets() {
        this.repoKeys = [
            "earth.png.png",
            "level1.png",
            "level2.png",
            "level3.png",
            "player/main_char_1.png",
            "player/main_char_2.png",
            "tile.png",
            ...Speaker.SPEAKER_SPRITES
        ].concat(Array(37).fill(null).map((e, i) => `background/${i}.jpg`));
        this.repo = new ImageLoader(this.repoKeys, Game.IMG_PATH);
    }
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    loader() {
        if (!this.repo.isLoading() && this.fps !== 0) {
            if (this.menuView === undefined) {
                this.gamestate = GameState.Main;
                this.menuView = new MenuView(this.repo, this.ctx, this.canvas.width, this.canvas.height);
                this.initializeLevels();
            }
        }
        else {
            this.ctx.fillText("Loading...", this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    mainState() {
        this.menuView.frames = this.passedFrames;
        this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift());
        this.menuView.drawMenu();
        const levelInteracted = this.menuView.interactsWithLevel();
        if (levelInteracted[0]) {
            this.gamestate = GameState.Play;
            this.currentLevelIndex = levelInteracted[1];
        }
    }
    playState() {
        const currentLevel = this.LevelViews[this.currentLevelIndex];
        currentLevel.drawLevel();
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_ESCAPE)) {
            this.gamestate = GameState.Main;
        }
    }
}
Game.IMG_PATH = "./assets/img/";
Game.AUDIO_PATH = "./assets/audio/";
Game.AMOUNT_OF_LEVELS = 3;
class Logic {
    constructor(repo) {
        this._frames = 0;
        this.repo = repo;
    }
    set frames(frame) {
        this._frames = frame;
    }
    animate(ms) {
        const timePerFrameSec = 1000 / window.fps;
        const statement = this._frames % (ms / timePerFrameSec) === 0;
        return statement;
    }
}
class Level extends Logic {
    constructor(config, repo, width, height) {
        super(repo);
        this.blocks = [];
        this.spikes = [];
        this.height = height;
        this.width = width;
        const entries = Object.entries(config);
        this.initializePlatforms(entries);
        this.initializeSpikes(entries);
        this.keyboardListener = new KeyboardListener();
        const playerSprites = Player.PLAYER_SPRITES.map((key) => this.repo.getImage(key));
        this.player = new Player(this.width / 3, 0, 8, 40, playerSprites);
    }
    initializePlatforms(entries) {
        const tileSprite = this.repo.getImage("tile");
        this.name = String(entries.find((entry) => entry[0] === "name")[1]);
        Object.values(entries.find(entry => entry[0] === "platforms")[1]).forEach((settings, i) => {
            const amountOfTiles = Math.floor(settings.xEnd / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite));
                settings.xStart += tileSprite.width;
            }
        });
    }
    initializeSpikes(entries) {
    }
    movePlayer() {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.player.xPos > -1) {
            this.player.move(true);
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.player.xPos > 0) {
            this.player.move(false);
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
            this.player.jump();
        }
    }
}
class MenuLogic extends Logic {
    constructor(width, height, repo) {
        super(repo);
        this.canJump = { right: true, left: true };
        this.menuItems = [];
        this.speakers = [];
        this.currentPlayerImgIndex = { state: 0 };
        this.audio = true;
        this.width = width;
        this.height = height;
        this.backgroundAudio = new Audio(MenuLogic.MENU_MUSIC);
        this.backgroundAudio.loop = true;
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
    nextAnimation(amountOfFrames) {
        const statement = this._frames % amountOfFrames === 0;
        return statement;
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
}
MenuLogic.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
MenuLogic.AMOUNT_OF_FRAMES = 37;
class MenuView extends MenuLogic {
    constructor(repo, ctx, width, height) {
        super(width, height, repo);
        this.ctx = ctx;
        this.backgroundFrame = { frame: this.repo.getImage("0"), key: "0" };
    }
    drawInstructions() {
        const instructionText = "PRESS ENTER TO START LEVEL";
        const instructions = new TextString(this.width / 2, this.height / 2 + this.repo.getImage("earth").height, instructionText);
        instructions.fillStyle = "white";
        instructions.drawText(this.ctx);
    }
    drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            }
            else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
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
        if (this.nextAnimation(3)) {
            this.backgroundFrame.key = String(Number(this.backgroundFrame.key) + 1);
            if (Number(this.backgroundFrame.key) >= MenuLogic.AMOUNT_OF_FRAMES) {
                this.backgroundFrame.key = String(0);
            }
            this.backgroundFrame.frame = this.repo.getImage(this.backgroundFrame.key);
        }
        const background = this.repo.getImage("earth");
        background.width = 300;
        background.height = 300;
        this.ctx.drawImage(this.backgroundFrame.frame, 0, 0, this.width, this.height);
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
    }
}
class View extends Level {
    constructor(config, ctx, repo, width, height) {
        super(config, repo, width, height);
        this.currentPlayerImgIndex = { state: 0 };
        this.ctx = ctx;
    }
    drawLevel() {
        new TextString(this.width / 2, this.height / 2, this.name).drawText(this.ctx);
        this.blocks.forEach((block) => {
            block.draw(this.ctx);
        });
        this.movePlayer();
        this.drawPlayer();
        this.player.gravity();
    }
    nextAnimation(amountOfFrames) {
        const statement = this._frames % amountOfFrames === 0;
        return statement;
    }
    drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            }
            else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        this.player.draw(this.ctx, next);
    }
}
class GameEntity {
    constructor(x, y, velocityX = 0, velocityY = 0) {
        this._xPos = x;
        this._yPos = y;
        this._velocityX = velocityX;
        this._velocityY = velocityY;
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
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}
class Lava extends GameEntity {
    constructor(x, y) {
        super(x, y, 0);
    }
    draw(ctx) {
        ctx.drawImage;
    }
}
class MenuItem extends GameEntity {
    constructor(x, y, img) {
        super(x, y);
        this.image = img;
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
    draw(ctx, state) {
        ctx.drawImage(this.images[state], this.xPos, this.yPos);
    }
}
Player.PLAYER_SPRITES = [`main_char_1.png`, `main_char_2.png`];
class Speaker extends GameEntity {
    constructor(x, y, velocity, img) {
        super(x, y, velocity);
        this.image = img;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.xPos, this.yPos);
    }
}
Speaker.SPEAKER_SPRITES = ["not-muted.png", "muted.png"];
class Spike extends GameEntity {
    constructor(x, y) {
        super(x, y, 0);
    }
    draw(ctx) {
        ctx.drawImage;
    }
}
class ClickHandler {
    static click(instance, method, measurements) {
        window.addEventListener("click", (event) => {
            instance[method]();
        });
    }
}
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
        const key = path.split("/").pop().split(".").shift();
        image.addEventListener("load", () => {
            this.images.push({ key: key, image: image });
            this.loadingAssets.splice(this.loadingAssets.indexOf(key), 1);
        });
        this.loadingAssets.push(key);
        image.src = path;
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
var GameState;
(function (GameState) {
    GameState[GameState["Load"] = 0] = "Load";
    GameState[GameState["Main"] = 1] = "Main";
    GameState[GameState["Play"] = 2] = "Play";
})(GameState || (GameState = {}));
var LevelState;
(function (LevelState) {
})(LevelState || (LevelState = {}));
//# sourceMappingURL=app.js.map