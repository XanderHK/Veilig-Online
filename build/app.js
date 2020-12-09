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
        this.menu = new Menu(this.ctx);
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
var GameState;
(function (GameState) {
    GameState[GameState["Main"] = 0] = "Main";
    GameState[GameState["Play"] = 1] = "Play";
})(GameState || (GameState = {}));
class Level {
}
var LevelState;
(function (LevelState) {
})(LevelState || (LevelState = {}));
class Menu {
    constructor(ctx) {
        this.ctx = ctx;
        this.background = new CreateImage(Menu.MENU_BACKGROUND).createImage();
    }
    drawMenu() {
        this.drawBackGround();
    }
    drawMenuItems() {
    }
    drawBackGround() {
        console.log(this.background);
        this.ctx.drawImage(this.background, 0, 0, window.innerWidth, window.innerHeight);
    }
}
Menu.MENU_BACKGROUND = Game.IMG_PATH + "yehesss.jpg";
class View extends Level {
}
window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'));
});
//# sourceMappingURL=app.js.map