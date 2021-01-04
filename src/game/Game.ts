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

    private LevelViews: View[] = [];

    private menuView: MenuView;

    private fps: number = 0;
    private passedFrames: number = 0;
    private ticks: number = 0;
    private last: number = 0;

    /**
     * Constructs the game
     * @param {HTMLElement} canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.initializeCanvas(canvas);
        this.initializeAssets();
        requestAnimationFrame(this.step);
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
            (window as any).fps = this.fps;
            this.ticks = 0;
        }
        if (this.fps === 0) {
            this.ticks++;
        }

        // Checks if all images have been loaded and if the fps has been set
        if (!this.repo.isLoading() && this.fps !== 0) {
            this.gamestate = GameState.Main;
            // Checks if the menu attribute has a menu instance
            if (this.menuView === undefined) {
                this.menuView = new MenuView(this.repo, this.ctx, this.canvas.width, this.canvas.height,)
            }
        } else {
            this.ctx.fillText("Loading...", this.canvas.width / 2, this.canvas.height / 2)
        }

        if (this.gamestate === GameState.Main) {
            this.menuView.frames = this.passedFrames;
            // Overwrites the repoKeys containing the paths to the actual keys
            this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift())
            // Draws the menu
            this.menuView.drawMenu();
        }
        this.passedFrames++;
        requestAnimationFrame(this.step);
    }
}
