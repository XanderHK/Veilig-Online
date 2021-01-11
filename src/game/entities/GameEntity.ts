abstract class GameEntity {

    private _xPos: number;
    private _yPos: number;
    private _velocityX: number;
    private _velocityY: number;

    /**
     * constructor of the GameItem class this will always be invoked through super in a subclass
     * @param {number} x 
     * @param {number} y 
     * @param {number} velocity 
     */
    public constructor(x: number, y: number, velocityX: number = 0, velocityY: number = 0) {
        this._xPos = x;
        this._yPos = y;
        this._velocityX = velocityX;
        this._velocityY = velocityY;
    }

    /**
     * Getter for the speed of the instance
     * @returns {number} - returns a number
     */
    public get velocityX(): number {
        return this._velocityX;
    }

    /**
     * Sets the velocity 
     * @param {number} velocity
     */
    public set velocityX(velocity: number) {
        this._velocityX = velocity;
    }


    /**
     * Getter for the speed of the instance
     * @returns {number} - returns a number
     */
    public get velocityY(): number {
        return this._velocityY;
    }

    /**
     * Sets the velocity 
     * @param {number} velocity
     */
    public set velocityY(velocity: number) {
        this._velocityY = velocity;
    }


    /**
     * Getter for the y position of the instance
     * @returns {number} - returns a number
     */
    public get yPos(): number {
        return this._yPos;
    }

    /** 
     * Getter for the x position of the instance
     * @returns {number} - returns a number
     */
    public get xPos(): number {
        return this._xPos;
    }

    /**
     * Setter for the y position of the instance
     * @param {number} x
     */
    public set yPos(y: number) {
        this._yPos = y;
    }

    /**
     * Setter for the x position of the instance
     * @param {number} x
     */
    public set xPos(x: number) {
        this._xPos = x;
    }

    public abstract draw(ctx: CanvasRenderingContext2D, state?: number): void

    public abstract get sprite(): HTMLImageElement

}