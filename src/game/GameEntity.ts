abstract class GameEntity {

    private _xPos: number;
    private _yPos: number;
    private _velocity: number;
    private _sprites: HTMLImageElement[] = [];
    private _spritesWidth: number[] = [];
    private _spritesHeight: number[] = [];

    /**
     * constructor of the GameItem class this will always be invoked through super in a subclass
     * @param {number} x 
     * @param {number} y 
     * @param {number} velocity 
     */
    public constructor(x: number, y: number, velocity: number = 0, sprites: string[] | string) {
        this._xPos = x;
        this._yPos = y;
        this._velocity = velocity;
        if (Array.isArray(sprites)) {
            for (let i = 0; i < sprites.length; i++) {
                const image = this.createImage(sprites[i]);
                image.addEventListener("load", () => {
                    this._spritesWidth.push(image.width);
                    this._spritesHeight.push(image.height)
                })
                this._sprites.push(image);
            }
        } else {
            const image = this.createImage(sprites);
            image.addEventListener("load", () => {
                this._spritesWidth.push(image.width);
                this._spritesHeight.push(image.height)
            })
            this._sprites.push(image);
        }
    }

    /**
     * Gets the width of a sprite
     * @param {number} index 
     */
    public getWidth(index: number = 0): number {
        return this._spritesWidth[index];
    }

    /**
    * Gets the height of a sprite
    * @param {number} index
    */
    public getHeight(index: number = 0): number {
        return this._spritesHeight[index];
    }

    /**
     * Gets a sprite of the current object
     * @param {number} index 
     */
    public getSprites(index?: number): HTMLImageElement {
        if (index === undefined) {
            index = 0;
        }
        return this._sprites[index];
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

    /**
    * Creates a HTML image element
    */
    private createImage(src: string, width?: number, height?: number): HTMLImageElement {
        const image: HTMLImageElement = document.createElement("img");
        image.src = src;
        if (width !== undefined) {
            image.width = width;
        }
        if (height !== undefined) {
            image.height = height;
        }
        return image;
    }

}