/**
 * Main class of this Game.
 */
class Game {

    public static readonly IMG_PATH = "./assets/img/";
    public static readonly AUDIO_PATH = "./assets/audio/";
    public static readonly AMOUNT_OF_LEVELS = 3;

    // The canvas
    private canvas: HTMLCanvasElement;
    // The canvas context
    private ctx: CanvasRenderingContext2D;

    private gamestate: GameState = GameState.Load;

    private repo: ImageLoader;
    private repoKeys: string[];
    private keyListener: KeyboardListener;

    private LevelViews: View[] = [];

    private menuView: MenuView;

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
        // Initial call to the loop
        this.step();
    }

    /**
     * Creates the levels
     */
    private initializeLevels() {
        for (let i = 0; i < Game.AMOUNT_OF_LEVELS; i++) {
            const config: Config = {
                name: `level ${i + 1}`,
                platforms: [
                    { xStart: 0, xEnd: 500, yStart: 100, yEnd: 200 },
                    { xStart: 0, xEnd: 100, yStart: 200, yEnd: 200 }
                ],
                spikes: [{ xStart: 0, xEnd: 500, yStart: 100, yEnd: 200 }]
            }
            this.LevelViews.push(new View(config, this.ctx, this.repo, this.canvas.width, this.canvas.height))
        }
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
            "player/main_char_1.png",
            "player/main_char_2.png",
            "tile.png",
            ...Speaker.SPEAKER_SPRITES
        ].concat(Array(37).fill(null).map((e, i) => `background/${i}.jpg`));
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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Method that makes sure all the images have been fully loaded and the fps has been determined
     */
    private loader() {
        if (!this.repo.isLoading() && this.fps !== 0) {
            // Checks if the menu attribute has a menu instance
            if (this.menuView === undefined) {
                this.gamestate = GameState.Main;
                this.menuView = new MenuView(this.repo, this.ctx, this.canvas.width, this.canvas.height);
                this.initializeLevels();
            }
        } else {
            this.ctx.fillText("Loading...", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    /**
     * Method that gets executed if the state is main which draws the menu
     */
    private mainState() {
        this.menuView.frames = this.passedFrames;
        // Overwrites the repoKeys containing the paths to the actual keys
        this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift());
        // Draws the menu
        this.menuView.drawMenu();

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
        currentLevel.drawLevel();
        if (this.keyListener.isKeyDown(KeyboardListener.KEY_ESCAPE)) {
            this.gamestate = GameState.Main;
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
    }
   
}
