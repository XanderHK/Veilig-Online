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
class Game {
    constructor(canvas) {
        this.views = [];
        this.currentLevel = 0;
        this.gameTexts = [];
        this.gamestate = GameState.Start;
        this.totalScore = 0;
        this.step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.gamestate === GameState.Finished) {
                this.resetGame();
            }
            this.processInputs();
            this.drawText();
            if (this.gamestate === GameState.Play) {
                this.views[this.currentLevel].update();
                if (this.views[this.currentLevel].isLevelFailed()) {
                    this.gamestate = GameState.End;
                    this.resetGame();
                }
                if (this.views[this.currentLevel].isNextLevel()) {
                    this.gamestate = GameState.Next;
                    this.totalScore += this.views[this.currentLevel].score;
                    if (this.currentLevel === Game.AMOUNT_OF_LEVELS - 1) {
                        this.gamestate = GameState.Finished;
                    }
                    else {
                        this.currentLevel++;
                    }
                }
            }
            requestAnimationFrame(this.step);
        };
        this.initializeCanvas(canvas);
        this.initializeInstances();
        requestAnimationFrame(this.step);
    }
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth / 3;
        this.canvas.height = window.innerHeight;
    }
    initializeInstances() {
        const basePath = "./assets/img/backgrounds/";
        const backgrounds = [`${basePath}istockphoto-1008358364-640x640.jpg`, `${basePath}2.jpg`, `${basePath}3.jpg`, `${basePath}4.jpg`, `${basePath}5.png`];
        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((options, current, index) => {
            this.views.push(new View(this.canvas, this.ctx, options.strikes, options.objects, options.spawnrate, options.threshold, backgrounds[index]));
            options.strikes--;
            options.objects++;
            options.threshold *= 2;
            options.spawnrate--;
            return options;
        }, { strikes: Game.INITIAL_STRIKES, objects: Game.INITIAL_OBJECTS, spawnrate: Game.AMOUNT_OF_LEVELS - 1, threshold: Game.INITIAL_THRESHOLD });
        this.keyListener = new KeyListener();
        this.InitializeTextInstances();
    }
    InitializeTextInstances() {
        this.gameTexts.push({ name: "instructions", instance: new TextString(this.canvas.width / 2, 40, "UP arrow = middle | LEFT arrow = left | RIGHT arrow = right"), category: GameState.Play });
        this.gameTexts.push({ name: "start", instance: new TextString(this.canvas.width / 2, 80, "Press R to start"), category: GameState.Start });
        this.gameTexts.push({ name: "end", instance: new TextString(this.canvas.width / 2, 80, "Press T to restart"), category: GameState.End });
        this.gameTexts.push({ name: "next", instance: new TextString(this.canvas.width / 2, 80, "Press X to continue"), category: GameState.Next });
        this.gameTexts.push({ name: "level", instance: new TextString(this.canvas.width / 2, 200, "Level " + String(this.currentLevel)), category: GameState.Play });
        this.gameTexts.push({ name: "finished", instance: new TextString(this.canvas.width / 2, 240, "You completed the game press K to restart"), category: GameState.Finished });
        this.gameTexts.push({ name: "total", instance: new TextString(this.canvas.width / 2, 280, String(this.totalScore)), category: "any" });
    }
    processInputs() {
        if (this.keyListener.isKeyDown(KeyListener.KEY_R) && this.gamestate === GameState.Start) {
            this.gamestate = GameState.Play;
        }
        if (this.keyListener.isKeyDown(KeyListener.KEY_T) && this.gamestate === GameState.End) {
            this.gamestate = GameState.Start;
        }
        if (this.keyListener.isKeyDown(KeyListener.KEY_X) && this.gamestate === GameState.Next) {
            this.gamestate = GameState.Play;
        }
        if (this.keyListener.isKeyDown(KeyListener.KEY_K) && this.gamestate === GameState.Finished) {
            this.gamestate = GameState.Start;
        }
    }
    drawText() {
        this.gameTexts.filter((element) => element.category === this.gamestate || element.category === "any").forEach((text) => {
            if (text.name === "level")
                text.instance.text = "Level " + String(this.currentLevel + 1);
            if (text.name === "total")
                text.instance.text = String(this.totalScore);
            text.instance.drawText(this.ctx);
        });
    }
    resetGame() {
        this.totalScore = 0;
        this.views = [];
        this.initializeInstances();
    }
}
Game.INITIAL_Y = 60;
Game.TOP_PADDING = 150;
Game.AMOUNT_OF_LEVELS = 5;
Game.INITIAL_STRIKES = 10;
Game.INITIAL_OBJECTS = 10;
Game.INITIAL_SPAWN_RATE = 6;
Game.INITIAL_THRESHOLD = 100;
var GameState;
(function (GameState) {
    GameState[GameState["Start"] = 0] = "Start";
    GameState[GameState["Play"] = 1] = "Play";
    GameState[GameState["End"] = 2] = "End";
    GameState[GameState["Next"] = 3] = "Next";
    GameState[GameState["Finished"] = 4] = "Finished";
})(GameState || (GameState = {}));
class KeyListener {
    constructor() {
        this.keyCodeStates = new Array();
        this.keyCodeTyped = new Array();
        this.previousState = new Array();
        window.addEventListener("keydown", (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        });
    }
    onFrameStart() {
        this.keyCodeTyped = new Array();
        this.keyCodeStates.forEach((val, key) => {
            if (this.previousState[key] != val && !this.keyCodeStates[key]) {
                this.keyCodeTyped[key] = true;
                this.previousState[key] = val;
            }
        });
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] == true;
    }
    isKeyTyped(keyCode) {
        return this.keyCodeTyped[keyCode] == true;
    }
}
KeyListener.KEY_ENTER = 13;
KeyListener.KEY_SHIFT = 16;
KeyListener.KEY_CTRL = 17;
KeyListener.KEY_ALT = 18;
KeyListener.KEY_ESC = 27;
KeyListener.KEY_SPACE = 32;
KeyListener.KEY_LEFT = 37;
KeyListener.KEY_UP = 38;
KeyListener.KEY_RIGHT = 39;
KeyListener.KEY_DOWN = 40;
KeyListener.KEY_DEL = 46;
KeyListener.KEY_1 = 49;
KeyListener.KEY_2 = 50;
KeyListener.KEY_3 = 51;
KeyListener.KEY_4 = 52;
KeyListener.KEY_5 = 53;
KeyListener.KEY_6 = 54;
KeyListener.KEY_7 = 55;
KeyListener.KEY_8 = 56;
KeyListener.KEY_9 = 57;
KeyListener.KEY_0 = 58;
KeyListener.KEY_A = 65;
KeyListener.KEY_B = 66;
KeyListener.KEY_C = 67;
KeyListener.KEY_D = 68;
KeyListener.KEY_E = 69;
KeyListener.KEY_F = 70;
KeyListener.KEY_G = 71;
KeyListener.KEY_H = 72;
KeyListener.KEY_I = 73;
KeyListener.KEY_J = 74;
KeyListener.KEY_K = 75;
KeyListener.KEY_L = 76;
KeyListener.KEY_M = 77;
KeyListener.KEY_N = 78;
KeyListener.KEY_O = 79;
KeyListener.KEY_P = 80;
KeyListener.KEY_Q = 81;
KeyListener.KEY_R = 82;
KeyListener.KEY_S = 83;
KeyListener.KEY_T = 84;
KeyListener.KEY_U = 85;
KeyListener.KEY_V = 86;
KeyListener.KEY_W = 87;
KeyListener.KEY_X = 88;
KeyListener.KEY_Y = 89;
KeyListener.KEY_Z = 90;
class Level {
    constructor(strikes, objects, spawnRate, threshold, canvas) {
        this._score = 0;
        this.combinedTrophies = [];
        this.timer = 0;
        this.lanes = { left: 0, middle: 0, right: 0 };
        this.strikes = 0;
        this.canvasHeight = canvas.height;
        this.maxStrikes = strikes;
        this.maxFallingObjects = objects;
        this.timeBeforeNext = (spawnRate > 0 ? spawnRate : 1);
        this.threshold = threshold;
        this.keyListener = new KeyListener();
        this.initializeLanes(canvas);
        this.player = new Player(this.lanes.left, this.canvasHeight - Game.TOP_PADDING);
    }
    initializeLanes(canvas) {
        this.lanes.left = canvas.width / 4;
        this.lanes.middle = canvas.width / 2;
        this.lanes.right = canvas.width / 4 * 3;
    }
    addNewTrophy() {
        const lanesObj = this.lanes;
        const randomIndex = Math.floor(Math.random() * Object.keys(this.lanes).length);
        const key = Object.keys(lanesObj)[randomIndex];
        if (this.combinedTrophies.length <= this.maxFallingObjects) {
            const objectArr = [new Lightning(this.lanes[key], Game.INITIAL_Y), new Trophy(this.lanes[key], Game.INITIAL_Y), new Star(this.lanes[key], Game.INITIAL_Y), new RedCross(this.lanes[key], Game.INITIAL_Y)];
            const randomObjIndex = this.randomInteger(0, objectArr.length - 1);
            this.combinedTrophies.push(objectArr[randomObjIndex]);
        }
        if (this.combinedTrophies.length === this.maxFallingObjects) {
            this.combinedTrophies.shift();
        }
    }
    collisionDetection() {
        this.combinedTrophies.forEach((trophy, index) => {
            if (this.player.collidesWithTrophy(trophy, this.canvasHeight)) {
                if (trophy instanceof Trophy) {
                    this._score += trophy.score;
                    this.combinedTrophies.splice(index, 1);
                    this.addNewTrophy();
                }
                if (trophy instanceof Lightning || trophy instanceof RedCross) {
                    this.combinedTrophies.splice(index, 1);
                    this._score -= trophy.score;
                }
                if (trophy instanceof Star) {
                    this.strikes--;
                    this.combinedTrophies.splice(index, 1);
                    this._score += trophy.score;
                }
                this.setNewPos(trophy);
            }
            if (trophy.collidesWithBottom(this.canvasHeight, trophy.image.width)) {
                if (trophy instanceof Trophy) {
                    this.strikes++;
                }
                this.setNewPos(trophy);
            }
        });
    }
    setNewPos(trophy) {
        const random = this.randomInteger(1, 3);
        trophy.posX = Object.values(this.lanes).reduce(this.reduceMethod(random));
        trophy.posY = Game.INITIAL_Y;
    }
    reduceMethod(random) {
        return (result, currentItem, index) => {
            if (random === index) {
                result = currentItem;
            }
            return result;
        };
    }
    processInputs() {
        this.player.move(this.keyListener, this.lanes);
    }
    randomInteger(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    isLevelFailed() {
        const statement = this.strikes >= this.maxStrikes;
        return statement;
    }
    isNextLevel() {
        const statement = this.score >= this.threshold;
        return statement;
    }
    get score() {
        return this._score;
    }
}
Level.MAX_STARS = 2;
Level.MAX_CROSSES = 2;
class ScoringObject {
    constructor(x, y, speed) {
        this._posX = x;
        this._posY = y;
        this._speed = speed;
    }
    randomInteger(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    move() {
        this._posY = this._posY + this._speed;
    }
    collidesWithBottom(height, imgWidth) {
        const statement = (this.posY + imgWidth > height);
        return statement;
    }
    loadNewImage(source) {
        return new CreateImage(source).createImage();
    }
    render(ctx) {
        ctx.drawImage(this._image, this.posX, this.posY);
    }
    get posX() {
        return this._posX;
    }
    get posY() {
        return this._posY;
    }
    get speed() {
        return this._speed;
    }
    set posX(x) {
        this._posX = x;
    }
    set posY(y) {
        this._posY = y;
    }
    get image() {
        return this._image;
    }
    get score() {
        return this._score;
    }
}
class Lightning extends ScoringObject {
    constructor(x, y) {
        super(x, y, Lightning.SPEED);
        this._image = this.loadNewImage(Lightning.IMG_SRC);
        this._score = this.randomInteger(Lightning.MIN_VALUE, Lightning.MAX_VALUE);
    }
}
Lightning.IMG_SRC = "assets/img/objects/titled_yellow_power_icon.png";
Lightning.SPEED = 10;
Lightning.MAX_VALUE = 10;
Lightning.MIN_VALUE = 3;
class Player {
    constructor(x, y) {
        this.playerImage = new CreateImage(Player.IMG_SRC);
        this._playerPositionX = x;
        this._playerPositionY = y;
    }
    get getPlayerPositionX() {
        return this._playerPositionX;
    }
    set setPlayerPositionX(x) {
        this._playerPositionX = x;
    }
    get image() {
        return this.playerImage.createImage();
    }
    move(keyListener, lanes) {
        if (keyListener.isKeyDown(KeyListener.KEY_LEFT) && this.getPlayerPositionX !== lanes.left) {
            this.setPlayerPositionX = lanes.left;
        }
        if (keyListener.isKeyDown(KeyListener.KEY_UP) && this.getPlayerPositionX !== lanes.middle) {
            this.setPlayerPositionX = lanes.middle;
        }
        if (keyListener.isKeyDown(KeyListener.KEY_RIGHT) && this.getPlayerPositionX !== lanes.right) {
            this.setPlayerPositionX = lanes.right;
        }
    }
    collidesWithTrophy(objectTrophy, height) {
        const statement = (this.getPlayerPositionX < objectTrophy.posX + objectTrophy.image.width
            && this.getPlayerPositionX + this.image.width > objectTrophy.posX
            && height - 150 < objectTrophy.posY + objectTrophy.image.height
            && height - 150 + this.image.height > objectTrophy.posY);
        return statement;
    }
    render(ctx) {
        ctx.drawImage(this.playerImage.createImage(), this._playerPositionX, this._playerPositionY);
    }
}
Player.IMG_SRC = "./assets/img/players/character_robot_walk0.png";
class RedCross extends ScoringObject {
    constructor(x, y) {
        super(x, y, RedCross.SPEED);
        this._image = this.loadNewImage(RedCross.IMG_SRC);
        this._score = this.randomInteger(RedCross.MIN_VALUE, RedCross.MAX_VALUE);
    }
}
RedCross.IMG_SRC = "assets/img/objects/tilted_cross.png";
RedCross.SPEED = 2;
RedCross.MAX_VALUE = 100;
RedCross.MIN_VALUE = 10;
class Star extends ScoringObject {
    constructor(x, y) {
        super(x, y, Star.SPEED);
        this._image = new CreateImage(Star.IMG_SRC).createImage();
        this._score = this.randomInteger(Star.MIN_VALUE, Star.MAX_VALUE);
    }
}
Star.IMG_SRC = "assets/img/objects/tilted_star.png";
Star.SPEED = 3;
Star.MAX_VALUE = 100;
Star.MIN_VALUE = 10;
class TextString {
    constructor(x, y, text) {
        this.font = "Edmunds";
        this.fontSize = 20;
        this.fillStyle = "white";
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
class Trophy extends ScoringObject {
    constructor(x, y) {
        super(x, y, Trophy.SPEED);
        this._image = new CreateImage(Trophy.IMG_SRC).createImage();
        this._score = this.randomInteger(Trophy.MIN_VALUE, Trophy.MAX_VALUE);
    }
}
Trophy.IMG_SRC = "assets/img/objects/gold_trophy.png";
Trophy.SPEED = 5;
Trophy.MAX_VALUE = 10;
Trophy.MIN_VALUE = 3;
class View extends Level {
    constructor(canvas, ctx, strikes, objects, spawnRate, threshold, background) {
        super(strikes, objects, spawnRate, threshold, canvas);
        this.levelTexts = [];
        this.addNewTrophy();
        this.canvas = canvas;
        this.background = new CreateImage(background).createImage(this.canvas.height, this.canvas.width);
        this.ctx = ctx;
        this.levelTexts.push({ name: "score", instance: new TextString(this.canvas.width / 2, 100, `Score : ${String(this.score)}`), category: GameState.Play });
        this.levelTexts.push({ name: "strike", instance: new TextString(this.canvas.width / 2, 150, `Lives : ${String(this.maxStrikes)}`), category: GameState.Play });
    }
    update() {
        this.drawBackground();
        this.drawLevelText();
        this.processInputs();
        if (this.timer === this.timeBeforeNext * 60) {
            this.addNewTrophy();
            this.timer = 0;
        }
        this.collisionDetection();
        this.renderObjects();
        this.timer++;
    }
    drawLevelText() {
        this.levelTexts.forEach((text) => {
            if (text.name === "score") {
                text.instance.text = "Score : " + String(this.score);
            }
            if (text.name === "strike") {
                text.instance.text = "Lives : " + String(this.maxStrikes - this.strikes);
            }
            text.instance.drawText(this.ctx);
        });
    }
    renderObjects() {
        this.player.render(this.ctx);
        this.combinedTrophies.forEach((trophy) => {
            trophy.move();
            trophy.render(this.ctx);
        });
    }
    drawBackground() {
        this.ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height);
    }
}
window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'));
});
//# sourceMappingURL=app.js.map