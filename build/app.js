<<<<<<< HEAD
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
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.background = new CreateImage(Menu.MENU_BACKGROUND).createImage();
        this.activeSpeaker = new CreateImage(Game.IMG_PATH + "not-muted.png").createImage(50, 50);
        this.inacitveSpeaker = new CreateImage(Game.IMG_PATH + "muted.png").createImage(50, 50);
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
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
        window.addEventListener("click", event => {
            if (event.clientX >= 0 &&
                event.clientX < 0 + this.activeSpeaker.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + this.activeSpeaker.height) {
                this.audio = (this.audio === true ? false : true);
            }
        });
    }
    drawMenuItems() {
        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((result, current, index) => {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(result, this.height / 4, 100, 25);
            const text = new TextString(result, this.height / 4, `Level ${index + 1}`);
            text.fillStyle = "white";
            text.fontSize = 14;
            text.drawText(this.ctx);
            result += 150;
            return result;
        }, this.width / 2 - 175);
    }
    drawSpeaker() {
        let speaker = this.activeSpeaker;
        if (!this.audio)
            speaker = this.inacitveSpeaker;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, speaker.width, speaker.height);
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height);
    }
    drawBackGround() {
        this.ctx.drawImage(this.background, 0, 0, window.innerWidth, window.innerHeight);
    }
}
Menu.MENU_BACKGROUND = Game.IMG_PATH + "yehesss.jpg";
Menu.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
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
=======
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
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.background = new CreateImage(Menu.MENU_BACKGROUND).createImage();
        this.activeSpeaker = new CreateImage(Game.IMG_PATH + "not-muted.png").createImage(50, 50);
        this.inacitveSpeaker = new CreateImage(Game.IMG_PATH + "muted.png").createImage(50, 50);
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
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
        window.addEventListener("click", event => {
            if (event.clientX >= 0 &&
                event.clientX < 0 + this.activeSpeaker.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + this.activeSpeaker.height) {
                this.audio = (this.audio === true ? false : true);
            }
        });
    }
    drawMenuItems() {
        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((result, current, index) => {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(result, this.height / 4, 100, 25);
            const text = new TextString(result, this.height / 4, `Level ${index + 1}`);
            text.fillStyle = "white";
            text.fontSize = 14;
            text.drawText(this.ctx);
            result += 150;
            return result;
        }, this.width / 2 - 175);
    }
    drawSpeaker() {
        let speaker = this.activeSpeaker;
        if (!this.audio)
            speaker = this.inacitveSpeaker;
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height);
    }
    drawBackGround() {
        this.ctx.drawImage(this.background, 0, 0, window.innerWidth, window.innerHeight);
    }
}
Menu.MENU_BACKGROUND = Game.IMG_PATH + "yehesss.jpg";
Menu.MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
class View extends Level {
    constructor() {
        super();
    }
}
class ClickHandler {
    constructor(objects) {
        this.clickableObjects = [];
        this.clickableObjects = objects;
        window.addEventListener("click", this.clickAction);
    }
    clickAction(event) {
        Array.from(this.clickableObjects).forEach((instance, index) => {
            if (event.clientX >= instance.xPos &&
                event.clientX < instance.xPos + instance.image.width &&
                event.clientY >= instance.yPos &&
                event.clientY <= instance.yPos + instance.image.height) {
            }
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
>>>>>>> feature-tijn
//# sourceMappingURL=app.js.map