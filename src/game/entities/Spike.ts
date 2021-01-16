/// <reference path="GameEntity.ts"/>
class Spike extends GameEntity {

    public static readonly SPRITE = [""];

    private img: HTMLImageElement;

    public constructor(x: number, y: number, sprite: HTMLImageElement) {
        super(x, y, 0, 0);
        this.img = sprite;
    }

    /**
    * Gets the sprite of the object
    */
    public get sprite(): HTMLImageElement {
        return this.img;
    }

    /**
    * Draws the object
    * @param {CanvasRenderingContext2D} ctx
    */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos)
    }
}