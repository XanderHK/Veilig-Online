class Coin extends GameEntity {

    public static readonly SCORE = 10;

    private img: HTMLImageElement;
    private _score: number;

    public constructor(x: number, y: number, sprite: HTMLImageElement) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._score = Coin.SCORE;
    }

    /**
     * Gets the sprite of the object
     */
    public get sprite(): HTMLImageElement {
        return this.img;
    }

    public get score(): number {
        return this._score;
    }

    /**
    * Draws the object
    * @param {CanvasRenderingContext2D} ctx
    */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos, this.img.width, this.img.height);
    }
}