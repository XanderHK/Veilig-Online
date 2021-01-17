abstract class GameEntity {

    private _xPos: number;
    private _yPos: number;
    private _velocity: number;

    /**
     * constructor of the GameItem class this will always be invoked through super in a subclass
     * @param {number} x 
     * @param {number} y 
     * @param {number} velocity 
     */
    public constructor(x: number, y: number, velocity: number = 0) {
        this._xPos = x;
        this._yPos = y;
        this._velocity = velocity;
    }

    /**
     * Getter for the speed of the instance
     * @returns {number} - returns a number
     */
    public get velocity(): number {
        return this._velocity;
    }

    /**
     * Sets the velocity 
     * @param {number} velocity
     */
    public set velocity(velocity: number) {
        this._velocity = velocity;
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

}