/// <reference path="GameEntity.ts"/>
class Player extends GameEntity {

    public static readonly PLAYER_SPRITES = [`main_char_1.png`, `main_char_2.png`, `run-left1.png`, `run-left2.png`, `run-left3.png`, `run-left4.png`, `run-left5.png`, `run-left6.png`,
        `run-right1.png`, `run-right2.png`, `run-right3.png`, `run-right4.png`, `run-right5.png`, `run-right6.png`];

    private images: HTMLImageElement[];


    /**
     * Constructs the player
     * @param {number} x 
     * @param {number} y
     * @param {number} velocityX
     * @param {number} velocityY
     * @param {HTMLImageElement[]} sprites
     */
    public constructor(x: number, y: number, velocityX: number, velocityY: number, sprites: HTMLImageElement[]) {
        super(x, y, velocityX, velocityY);
        this.images = sprites;
    }

    /**
     * increments the xpos of the player instance by x amount of pixels every frame
     * @param {boolean} direction 
     */
    public move(direction: boolean) {
        const nextXPos = this.xPos + (direction ? this.velocityX : -this.velocityX);
        this.xPos = nextXPos;

    }

    /**
     * decrements the ypos of the player resulting in it moving upwards on the canvas
     */
    public jump() {
        this.yPos -= this.velocityY;
    }

    /**
     * increments the ypos of the player resulting in it moving downwards on the canvas
     */
    public gravity() {
        this.yPos += this.velocityY / 2;
    }

    /**
     * Gets all the sprites from the player instance
     */
    public get sprites(): HTMLImageElement[] {
        return this.images;
    }

    /**
     * Gets the first sprite of the player object
     */
    public get sprite(): HTMLImageElement {
        return this.images[0];
    }

    /**
     * Draws one of the sprites of the player depending on what number the state is
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} state 
     */
    public draw(ctx: CanvasRenderingContext2D, state: number) {
        ctx.drawImage(this.images[state], this.xPos, this.yPos, this.images[state].width, this.images[state].height);
    }
}