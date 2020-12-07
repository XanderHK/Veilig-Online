// Type that holds every possible instance type of scoring object
// This is to prevent the use of Trophy | Lightning | Star everytime we have a scoring object instance as argument/ parameter
type ScoringInstances = Trophy | Lightning | Star | RedCross;
/**
 * Main class of this Game.
 */
class Game {

    // Constants of the game class (Basically the settings of the game)
    public static readonly INITIAL_Y = 60;
    public static readonly TOP_PADDING = 150;
    public static readonly AMOUNT_OF_LEVELS = 5;
    public static readonly INITIAL_STRIKES = 10;
    public static readonly INITIAL_OBJECTS = 10
    public static readonly INITIAL_SPAWN_RATE = 6;
    public static readonly INITIAL_THRESHOLD = 100;
    // The canvas
    private canvas: HTMLCanvasElement;
    // The canvas context
    private ctx: CanvasRenderingContext2D;
    private views: View[] = [];
    private currentLevel: number = 0;
    // KeyListener so the user can give input
    private keyListener: KeyListener;
    // The textstrings
    private gameTexts: { name: string, instance: TextString, category: GameState | string }[] = [];
    // The gamestate
    private gamestate: GameState = GameState.Start;
    // Attribute that stores the total accumulated score 
    private totalScore: number = 0;
    /**
     * Constructs the game
     * @param {HTMLElement} canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.initializeCanvas(canvas);
        this.initializeInstances();
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
        this.canvas.width = window.innerWidth / 3;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Method that initializes every object that we will be using
     */
    private initializeInstances() {
        const basePath: string = "./assets/img/backgrounds/";
        const backgrounds: string[] = [`${basePath}istockphoto-1008358364-640x640.jpg`, `${basePath}2.jpg`, `${basePath}3.jpg`, `${basePath}4.jpg`, `${basePath}5.png`];
        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((options, current, index) => {
            this.views.push(new View(this.canvas, this.ctx, options.strikes, options.objects, options.spawnrate, options.threshold, backgrounds[index]));
            // Removes one life for every level
            options.strikes--;
            // Increases the amount of objects you can have at one time
            options.objects++;
            // Doubles the score needed for every level
            options.threshold *= 2;
            // Lowers the spawnrate by 1s
            options.spawnrate--;
            return options;
        }, { strikes: Game.INITIAL_STRIKES, objects: Game.INITIAL_OBJECTS, spawnrate: Game.AMOUNT_OF_LEVELS - 1, threshold: Game.INITIAL_THRESHOLD })
        this.keyListener = new KeyListener();
        this.InitializeTextInstances();
    }

    /**
     * Method that makes the necessary instances of TextString
     */
    private InitializeTextInstances() {
        // Pushes the objects containing the TextString instance and other properties for the purpose of distinguishing eachother onto the gameTexts array
        this.gameTexts.push({ name: "instructions", instance: new TextString(this.canvas.width / 2, 40, "UP arrow = middle | LEFT arrow = left | RIGHT arrow = right"), category: GameState.Play });
        this.gameTexts.push({ name: "start", instance: new TextString(this.canvas.width / 2, 80, "Press R to start"), category: GameState.Start });
        this.gameTexts.push({ name: "end", instance: new TextString(this.canvas.width / 2, 80, "Press T to restart"), category: GameState.End });
        this.gameTexts.push({ name: "next", instance: new TextString(this.canvas.width / 2, 80, "Press X to continue"), category: GameState.Next });
        this.gameTexts.push({ name: "level", instance: new TextString(this.canvas.width / 2, 200, "Level " + String(this.currentLevel)), category: GameState.Play });
        this.gameTexts.push({ name: "finished", instance: new TextString(this.canvas.width / 2, 240, "You completed the game press K to restart"), category: GameState.Finished });
        this.gameTexts.push({ name: "total", instance: new TextString(this.canvas.width / 2, 280, String(this.totalScore)), category: "any" });
    }

    /**
     * Method that delegates the keyboard listener to the player so he can access it
     */
    private processInputs() {
        // Sets the gamestate to play when R is pressed
        if (this.keyListener.isKeyDown(KeyListener.KEY_R) && this.gamestate === GameState.Start) {
            this.gamestate = GameState.Play;
        }
        // Reset the state to begin when T is pressed after you've ran out of lives / have got 10 strikes
        if (this.keyListener.isKeyDown(KeyListener.KEY_T) && this.gamestate === GameState.End) {
            this.gamestate = GameState.Start;
        }
        // Sets the gamestate to play if the gamestate is next
        if (this.keyListener.isKeyDown(KeyListener.KEY_X) && this.gamestate === GameState.Next) {
            this.gamestate = GameState.Play;
        }
        // Sets the gamestate to start if the gamestate is finished
        if (this.keyListener.isKeyDown(KeyListener.KEY_K) && this.gamestate === GameState.Finished) {
            this.gamestate = GameState.Start;
        }
    }

    /**
     * Method that draws all the textstrings of the game
     */
    private drawText() {
        // Filters through the array and returns the ones that have their category set as the current gamestate
        this.gameTexts.filter((element) => element.category === this.gamestate || element.category === "any").forEach((text) => {
            if (text.name === "level") text.instance.text = "Level " + String(this.currentLevel + 1);
            if (text.name === "total") text.instance.text = String(this.totalScore);
            text.instance.drawText(this.ctx);
        })
    }

    /**
     * Method that returns the game to its initial state
     */
    private resetGame() {
        this.totalScore = 0;
        this.views = [];
        this.initializeInstances();
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = () => {
        // Clears teh canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gamestate === GameState.Finished) {
            this.resetGame();
        }
        // Invokes the processinputs methods
        this.processInputs();
        // Draws all the necessary text
        this.drawText();
        // Checks if the gamestate is play
        if (this.gamestate === GameState.Play) {
            // Invokes the update method
            this.views[this.currentLevel].update();

            // Resets the game if the level is failed aka you ran out of strikes
            if (this.views[this.currentLevel].isLevelFailed()) {
                this.gamestate = GameState.End;
                this.resetGame();
            }
            // Checks if you completed the level and it will increment the currentlevel attribute 
            if (this.views[this.currentLevel].isNextLevel()) {
                this.gamestate = GameState.Next;
                this.totalScore += this.views[this.currentLevel].score;
                if (this.currentLevel === Game.AMOUNT_OF_LEVELS - 1) {
                    this.gamestate = GameState.Finished;
                } else {
                    this.currentLevel++;
                }
            }
        }
        // Collision detection method for all the objects
        requestAnimationFrame(this.step);
    }
}
