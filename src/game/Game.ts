/**
 * Main class of this Game.
 */
class Game {
    public static readonly IMGGGG = "DDDDDD";
    // Class constants
    public static readonly IMG_PATH = "./assets/img/";
    public static readonly AUDIO_PATH = "./assets/audio/";
    public static readonly AMOUNT_OF_LEVELS = 3;
    public static readonly AMOUNT_OF_INFO = 2;
    public static readonly AMOUNT_OF_LIVES = 3;
    public static readonly AMOUNT_OF_ENEMIES = 2;
    public static readonly BASELINE_FPS = 60;

    // The canvas
    private canvas: HTMLCanvasElement;
    // The canvas context
    private ctx: CanvasRenderingContext2D;

    // State of the game
    private gamestate: GameState = GameState.Load;

    // All helper related properties
    private repo: ImageLoader;
    private repoKeys: string[];
    private keyListener: KeyboardListener;

    // All views
    private LevelViews: LevelView[] = [];
    private menuView: MenuView;
    // All textstrings
    private lostText: TextString;
    private loadText: TextString;
    private finishedText: TextString;
    private instructionTexts: TextString[] = [];

    // All number related properties
    private fps: number = 0;
    private passedFrames: number = 0;
    private ticks: number = 0;
    private last: number = 0;
    private currentLevelIndex: number;

    /**
     * Constructs the game
     * @param {HTMLElement} canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.keyListener = new KeyboardListener();
        this.initializeCanvas(canvas);
        this.initializeAssets();
        this.loadText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Loading...");
        this.lostText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Jij hebt verloren, druk op R om te herstarten.");
        this.finishedText = new TextString(this.canvas.width / 2, this.canvas.height / 2, "Je hebt het hele spel uitgespeeld, gefeliciteerd! Druk op R om het spel opnieuw te starten.")
        this.instructionTexts = this.initializeInstructionText();
        // Initial call to the loop
        this.step();
    }

    /**
     * Method that checks if the levels have finished loading in
     */
    private isLoading() {
        return this.LevelViews.length !== Game.AMOUNT_OF_LEVELS
    }

    /**
     * Creates the levels
     */
    private initializeLevels() {
        [1, 2, 3].forEach(async (n) => {
            const promise = await fetch(`./assets/json/level${n}.json`)
            const response = await promise.json();
            response["water"] = [{ xStart: 0, xEnd: window.innerWidth, yStart: window.innerHeight - this.repo.getImage("water").height, yEnd: 1050 }];
            this.LevelViews.push(new LevelView(response as Config, this.ctx, this.repo, this.canvas.width, this.canvas.height));
        })
    }
    /**
     * passes all the given image paths / keys to the ImageLoader instance that gets initialized in here that wil start the loading process of the images
     */
    private initializeAssets() {
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
            "enemy2.png",
            "winter.png",
            "lava.jpg",
            "Forest.jpg",
            "wintertile.png",
            "lavatile.png",
            "tile.png",
            ...Speaker.SPEAKER_SPRITES
        ].concat(Array(37).fill(null).map((e, i) => `background/${i}.jpg`)).concat(Player.PLAYER_SPRITES.map((sprite) => `player/${sprite}`));
        this.repo = new ImageLoader(this.repoKeys, Game.IMG_PATH);
    }

    /**
     * Method that initializes all canvas related items.
     * @param {HTMLElement} canvas 
     */
    private initializeCanvas(canvas: HTMLElement) {
        this.canvas = canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        // Resize the canvas so it looks more like a Runner game
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    private getAllScore() {
        this.menuView.totalScore = this.LevelViews.reduce((a, b) => {
            a += b.score;
            return a;
        }, 0)
    }

    /**
     * Method that makes sure all the images have been fully loaded and the fps has been determined and the json files containing the level information has been processed
     */
    private loader() {
        if (!this.repo.isLoading() && this.fps !== 0) {
            // Checks if the menu attribute has a menu instance
            if (this.menuView === undefined) {
                this.menuView = new MenuView(this.repo, this.ctx, this.canvas.width, this.canvas.height);
                this.initializeLevels();
            }
            if (this.menuView instanceof MenuView) {
                if (!this.isLoading()) {
                    // Sorts array in the correct numerical order
                    this.LevelViews.sort((a, b) => Number(a.name.replace(/^\D+/g, '')) - Number(b.name.replace(/^\D+/g, '')))
                    this.gamestate = GameState.Main;
                }
            }
        } else {
            this.loadText.drawText(this.ctx)
        }
    }

    /**
     * Method that gets executed if the state is main which draws the menu
     */
    private mainState() {
        this.getAllScore();
        this.beatTheGame();
        this.menuView.frames = this.passedFrames;
        // Overwrites the repoKeys containing the paths to the actual keys
        this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift());
        // Draws the menu
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

    /**
    * Method that gets executed if the state is play which draws the level
    */
    private playState() {
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
        } else {
            this.gamestate = GameState.GameOver
        }
    }

    /**
     * Method that gets executed if the state is over which re-initializes the levels
     */
    private overState() {
        this.lostText.drawText(this.ctx)
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_R)) {
            this.LevelViews.splice(0, this.LevelViews.length)
            this.initializeLevels();
            this.gamestate = GameState.Load
        }
    }

    /**
     * Method that gets executed every loop to check if the game has been beaten
     */
    private beatTheGame() {
        if (this.LevelViews.every((level: LevelView) => level.isComplete() === true)) {
            this.gamestate = GameState.GameBeaten
        }
    }

    /**
     * If the gamestate is GameBeaten it will draw on the screen that the game has been beaten
     */
    private winState() {
        this.finishedText.drawText(this.ctx);
        this.restart()
    }

    /**
     *  Draws all the instructions on the screen when the state is GameInstructions
     */
    private initializeInstructionText(): TextString[] {
        const textStringArr: TextString[] = [];
        const spaceBetween = 50;
        const text: string = `Druk op enter om te starten.
         Druk op I om het informatie scherm te openen.
         Druk op ESC om uit het informatie scherm te gaan.
         Druk op <- of -> om van level te veranderen in het menu.
         Druk op enter bij een informatie punt of vijand om het dialoogvenster te openen.
         Druk op Q om het dialoogvenster te sluiten.
         Beantwoordt de vragen van de vijand door op A of B te drukken.
         Beweeg het poppetje door middel van de <- of -> toets.
         Laat het poppetje springen door op pijl omhoog toets te drukken.
         Druk aan de zijkant van een block op de SPACEBAR om jezelf vasthouden, vervolgens kan je klimmen door op het pijltje omhoog te drukken.`;
        const textArr = text.split("\n");
        const startHeight = (this.canvas.height / 2) - ((textArr.length / 2) * spaceBetween)
        textArr.reduce((a: number, r: string) => {
            textStringArr.push(new TextString(this.canvas.width / 2, a, r));
            return a += spaceBetween;
        }, startHeight)
        return textStringArr;
    }

    /**
     * The method that gets exeucted when the game is in its instructions state
     */
    private instructionState() {
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_ESCAPE)) {
            this.gamestate = GameState.Main
        }
        this.instructionTexts.forEach((text: TextString) => {
            text.fontSize = Calculate.calculateX(24);
            text.drawText(this.ctx)
        })
    }

    /**
     * The restart method which refreshes the page
     */
    private restart() {
        if (this.gamestate === GameState.GameBeaten && this.keyListener.isKeyDown(KeyboardListener.KEY_R)) {
            location.reload();
        }
    }

    /**
     * Method that calculates the fps of the client
     */
    private calculateFps() {
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

    /**
     * This MUST be an arrow method in order to keep the `this` variable
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = () => {
        // Clears the canvas
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
    }
}
