/**
 * Main class of this Game.
 */
class Game {

    public static readonly IMG_PATH = "./assets/img/";

    // The canvas
    private canvas: HTMLCanvasElement;
    // The canvas context
    private ctx: CanvasRenderingContext2D;

    private gamestate: GameState = GameState.Main;

    private views: View[] = [];

    private menu: Menu;

    /**
     * Constructs the game
     * @param {HTMLElement} canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.initializeCanvas(canvas);
        this.menu = new Menu(this.ctx);
        requestAnimationFrame(this.step);
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
        if (this.gamestate === GameState.Main) {
            this.menu.drawMenu();
        }
        // Collision detection method for all the objects
        requestAnimationFrame(this.step);
    }
}
