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
    constructor(x, y, velocity = 0) {
        this._xPos = x;
        this._yPos = y;
        this._velocity = velocity;
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
}
class Level {
}
class Menu {
    constructor(ctx, width, height) {
        this.audio = true;
        this.currentPlayerImgIndex = { state: 0, frame: 0 };
        this.allImages = [];
        this.canJump = true;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        this.player = new Player(0, 0, 0);
        const levelObjHeight = this.findImage("levels")[0];
        const xpos = (this.width / 2 - 425) + (levelObjHeight.width / 2);
        this.player.xPos = xpos;
    }
    initializeImages() {
        const earth = new CreateImage(Menu.MENU_BACKGROUND).createImage(300, 300);
        const activeSpeaker = new CreateImage(Game.IMG_PATH + "not-muted.png").createImage(50, 50);
        const inactiveSpeaker = new CreateImage(Game.IMG_PATH + "muted.png").createImage(50, 50);
        const playerImages = Array(2).fill(null).map((e, i) => {
            return new CreateImage(Game.IMG_PATH + "player/main_char_" + Number(i + 1) + ".png").createImage();
        });
        const backgroundFrames = Array(Menu.AMOUNT_OF_FRAMES).fill(null).map((e, i) => {
            return new CreateImage(Game.IMG_PATH + `background/${i}.jpg`).createImage(this.width, this.height);
        });
        const levels = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            return new CreateImage(Game.IMG_PATH + `level${i + 1}.png`).createImage();
        });
        const allInitImages = { background: earth, activeSpeaker: activeSpeaker, inactiveSpeaker: inactiveSpeaker, playerImages: playerImages, backgroundFrames: backgroundFrames, levels: levels };
        Object.entries(allInitImages).forEach((e) => {
            let images = e[1];
            if (!Array.isArray(e[1])) {
                images = [e[1]];
            }
            this.allImages.push({ name: e[0], images: images });
        });
        const initialFrame = this.findImage("backgroundFrames")[0];
        this.backgroundFrame = { index: 0, frame: initialFrame };
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
    drawMenu() {
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        window.addEventListener("click", event => {
            const referenceImg = this.findImage("activeSpeaker")[0];
            if (event.clientX >= 0 &&
                event.clientX < 0 + referenceImg.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + referenceImg.height) {
                this.audio = (this.audio === true ? false : true);
            }
        });
    }
    findImage(name) {
        return this.allImages.find((e) => e.name === name).images;
    }
    drawPlayer() {
        if (this.currentPlayerImgIndex.frame % 15 === 0) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            }
            else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        const levelObjHeight = this.findImage("levels")[0];
        const playerPos = this.height / 10 * 3 + levelObjHeight.height;
        this.player.yPos = playerPos - this.player.getSprite(next).height;
        this.player.draw(this.ctx, next);
        this.currentPlayerImgIndex.frame++;
    }
    movePlayer() {
        const levels = this.findImage("levels");
        const maxBound = this.width / 2 - 425 + 600;
        const minBound = this.width / 2 - 425;
        console.log(this.player.xPos);
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJump && this.player.xPos <= maxBound) {
            this.canJump = false;
            this.player.xPos = this.player.xPos + 300;
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJump && this.player.xPos >= minBound) {
            this.canJump = false;
            this.player.xPos = this.player.xPos - 300;
        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJump) {
            this.canJump = true;
        }
    }
    drawMenuItems() {
        this.findImage("levels").reduce((result, current) => {
            this.ctx.drawImage(current, result, this.height / 10 * 2.5);
            console.log(current.width);
            result += current.width;
            return result;
        }, this.width / 2 - 425);
    }
    drawSpeaker() {
        let speaker = this.findImage("activeSpeaker")[0];
        if (!this.audio)
            speaker = this.findImage("inactiveSpeaker")[0];
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height);
    }
    drawBackGround() {
        if (this.backgroundFrame.index % 3 === 0) {
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
        this.backgroundFrame.index++;
    }
}
Menu.MENU_BACKGROUND = Game.IMG_PATH + "earth.png.png";
Menu.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
Menu.AMOUNT_OF_FRAMES = 37;
class Player extends GameEntity {
    constructor(x, y, velocity) {
        super(x, y, velocity);
        this.sprites = [];
        this.sprites = Player.PLAYER_SPRITES.map((e) => {
            return new CreateImage(e).createImage();
        });
    }
    getSprite(index) {
        return this.sprites[index];
    }
    draw(ctx, state) {
        ctx.drawImage(this.sprites[state], this.xPos, this.yPos);
    }
}
Player.PLAYER_SPRITES = [Game.IMG_PATH + `player/main_char_1.png`, Game.IMG_PATH + `player/main_char_2.png`];
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
    constructor(imgSrc) {
        this.imgSrc = imgSrc;
    }
    createImage(height, width) {
        const image = document.createElement("img");
        image.src = this.imgSrc;
        if (height > 0) {
            image.height = height;
        }
        if (width > 0) {
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