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

    private menu: Menu;

    /**
     * Constructs the game
     * @param {HTMLElement} canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.initializeCanvas(canvas);
        this.initializeAssets();
        requestAnimationFrame(this.step);
    }


    private initializeAssets() {
        this.repoKeys = [
            "earth.png.png",
            "level1.png",
            "level2.png",
            "level3.png",
            "player/main_char_1.png",
            "player/main_char_2.png",
            "muted.png",
            "not-muted.png"
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

        // Checks if all images have been loaded
        if (!this.repo.isLoading()) {
            this.gamestate = GameState.Main;
            // Checks if the menu attribute has a menu instance
            if (this.menu === undefined) {
                this.menu = new Menu(this.ctx, this.canvas.width, this.canvas.height, this.repo)
            }
        } else {
            this.ctx.fillText("Loading...", this.canvas.width / 2, this.canvas.height / 2)
        }

        if (this.gamestate === GameState.Main) {
            // Overwrites the repoKeys containing the paths to the actual keys
            this.repoKeys = this.repoKeys.map((path) => path.split("/").pop().split(".").shift())
            // Draws the menu
            this.menu.drawMenu();
        }
        requestAnimationFrame(this.step);
    }
}
