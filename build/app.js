window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'));
});
class Game {
    constructor(canvas) {
        this.gamestate = GameState.Main;
        this.views = [];
        this.step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.gamestate === GameState.Main) {
                this.menu.drawMenu();
            }
            requestAnimationFrame(this.step);
        };
        this.initializeCanvas(canvas);
        this.menu = new Menu(this.ctx, this.canvas.width, this.canvas.height);
        requestAnimationFrame(this.step);
    }
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
Game.IMG_PATH = "./assets/img/";
Game.AUDIO_PATH = "./assets/audio/";
Game.AMOUNT_OF_LEVELS = 3;
class GameEntity {
    constructor(x, y, velocity = 0, sprites) {
        this._sprites = [];
        this._spritesWidth = [];
        this._spritesHeight = [];
        this._xPos = x;
        this._yPos = y;
        this._velocity = velocity;
        if (Array.isArray(sprites)) {
            for (let i = 0; i < sprites.length; i++) {
                const image = this.createImage(sprites[i]);
                image.addEventListener("load", () => {
                    this._spritesWidth.push(image.width);
                    this._spritesHeight.push(image.height);
                });
                this._sprites.push(image);
            }
        }
        else {
            const image = this.createImage(sprites);
            image.addEventListener("load", () => {
                this._spritesWidth.push(image.width);
                this._spritesHeight.push(image.height);
            });
            this._sprites.push(image);
        }
    }
    getWidth(index = 0) {
        return this._spritesWidth[index];
    }
    getHeight(index = 0) {
        return this._spritesHeight[index];
    }
    getSprites(index) {
        if (index === undefined) {
            index = 0;
        }
        return this._sprites[index];
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity = velocity;
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
    createImage(src, width, height) {
        const image = document.createElement("img");
        image.src = src;
        if (width !== undefined) {
            image.width = width;
        }
        if (height !== undefined) {
            image.height = height;
        }
        return image;
    }
}
class Level {
}
class Menu {
    constructor(ctx, width, height) {
        this.allImages = [];
        this.menuItems = [];
        this.currentPlayerImgIndex = { state: 0 };
        this.audio = true;
        this.canJumpRight = true;
        this.canJumpLeft = true;
        this.frames = 0;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        this.player = new Player(this.width / 3, 0, 0);
    }
    initializeImages() {
        const earth = CreateImage.createImage(Menu.MENU_BACKGROUND, 300, 300);
        const activeSpeaker = CreateImage.createImage(Game.IMG_PATH + "not-muted.png", 50, 50);
        const inactiveSpeaker = CreateImage.createImage(Game.IMG_PATH + "muted.png", 50, 50);
        const backgroundFrames = Array(Menu.AMOUNT_OF_FRAMES).fill(null).map((e, i) => {
            return CreateImage.createImage(Game.IMG_PATH + `background/${i}.jpg`);
        });
        const allInitImages = { background: earth, activeSpeaker: activeSpeaker, inactiveSpeaker: inactiveSpeaker, backgroundFrames: backgroundFrames };
        Object.entries(allInitImages).forEach((e) => {
            let images = e[1];
            if (!Array.isArray(e[1])) {
                images = [e[1]];
            }
            this.allImages.push({ name: e[0], images: images });
        });
        this.menuItems = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            const instance = new MenuItem(0, this.height / 10 * 2.5, i);
            const image = instance.getSprites(0);
            image.addEventListener("load", () => {
                instance.xPos = this.width / 3 + (image.width * 2) * i;
            });
            return instance;
        });
        const initialFrame = this.findImage("backgroundFrames")[0];
        this.backgroundFrame = { frame: initialFrame };
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
    findImage(name) {
        return this.allImages.find((e) => e.name === name).images;
    }
    nextAnimation(amountOfFrames) {
        const statement = this.frames % amountOfFrames === 0;
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
        const levelObjHeight = this.menuItems[0].getSprites().height;
        const playerPos = this.height / 10 * 2.3 + levelObjHeight;
        this.player.yPos = playerPos - this.player.getSprites(next).height;
        this.player.draw(this.ctx, next);
    }
    movePlayer() {
        const maxBound = this.menuItems[this.menuItems.length - 1].xPos;
        const minBound = this.menuItems[0].xPos;
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJumpRight && this.player.xPos <= maxBound) {
            this.canJumpRight = false;
            const nextXPos = this.player.xPos + (this.menuItems[0].getSprites(0).width * 2);
            if (nextXPos <= maxBound) {
                this.player.xPos = nextXPos;
            }
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJumpLeft && this.player.xPos >= minBound) {
            this.canJumpLeft = false;
            const nextXPos = this.player.xPos - this.menuItems[0].getSprites(0).width * 2;
            if (nextXPos >= minBound) {
                this.player.xPos = nextXPos;
            }
        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !this.canJumpLeft) {
            this.canJumpLeft = true;
        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJumpRight) {
            this.canJumpRight = true;
        }
    }
    drawMenuItems() {
        this.menuItems.forEach(menuItem => {
            menuItem.draw(this.ctx);
        });
    }
    drawSpeaker() {
        let speaker = this.findImage("activeSpeaker")[0];
        if (!this.audio)
            speaker = this.findImage("inactiveSpeaker")[0];
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height);
    }
    drawBackGround() {
        if (this.nextAnimation(3)) {
            const current = this.findImage("backgroundFrames").indexOf(this.backgroundFrame.frame);
            let next = current + 1;
            if (next === Menu.AMOUNT_OF_FRAMES - 1) {
                next = 0;
            }
            this.backgroundFrame.frame = this.findImage("backgroundFrames")[next];
        }
        const background = this.findImage("background")[0];
        this.ctx.drawImage(this.backgroundFrame.frame, 0, 0, this.width, this.height);
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }
    interactsWithLevel() {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            this.menuItems.forEach((menuItem) => {
                const playerPos = this.player.xPos + this.player.getWidth();
                if (playerPos >= menuItem.xPos && playerPos <= menuItem.xPos + menuItem.getWidth()) {
                    console.log(menuItem.getSprites());
                }
            });
        }
    }
    drawMenu() {
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        this.interactsWithLevel();
        window.addEventListener("click", event => {
            const referenceImg = this.findImage("activeSpeaker")[0];
            if (event.clientX >= 0 &&
                event.clientX < 0 + referenceImg.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + referenceImg.height) {
                this.audio = (this.audio === true ? false : true);
            }
        });
        this.frames++;
    }
}
Menu.MENU_BACKGROUND = Game.IMG_PATH + "earth.png.png";
Menu.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
Menu.AMOUNT_OF_FRAMES = 37;
class MenuItem extends GameEntity {
    constructor(x, y, imgIndex) {
        const src = MenuItem.MENU_SPRITES[imgIndex];
        super(x, y, 0, src);
    }
    draw(ctx) {
        ctx.drawImage(this.getSprites(0), this.xPos, this.yPos);
    }
}
MenuItem.MENU_SPRITES = [Game.IMG_PATH + "level1.png", Game.IMG_PATH + "level2.png", Game.IMG_PATH + "level3.png"];
class Player extends GameEntity {
    constructor(x, y, velocity) {
        super(x, y, velocity, Player.PLAYER_SPRITES);
    }
    draw(ctx, state) {
        const sprite = this.getSprites(state);
        ctx.drawImage(sprite, this.xPos, this.yPos);
    }
}
Player.PLAYER_SPRITES = [Game.IMG_PATH + `player/main_char_1.png`, Game.IMG_PATH + `player/main_char_2.png`];
class Speaker extends GameEntity {
    constructor(x, y, velocity, img) {
        super(x, y, velocity, img);
    }
    draw(ctx, state) {
        const sprite = this.getSprites(state);
        ctx.drawImage(sprite, this.xPos, this.yPos);
    }
}
class View extends Level {
    constructor() {
        super();
    }
}
class ClickHandler {
    static click(instance, method, measurements) {
        window.addEventListener("click", (event) => {
            instance[method]();
        });
    }
}
class CreateImage {
    static createImage(src, width, height) {
        const image = document.createElement("img");
        image.src = src;
        if (height !== undefined) {
            image.height = height;
        }
        if (width !== undefined) {
            image.width = width;
        }
        return image;
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
    GameState[GameState["Main"] = 0] = "Main";
    GameState[GameState["Play"] = 1] = "Play";
})(GameState || (GameState = {}));
var LevelState;
(function (LevelState) {
})(LevelState || (LevelState = {}));
//# sourceMappingURL=app.js.map