/// <reference path="GameEntity.ts"/>
class Block extends GameEntity {
    private img: HTMLImageElement;

    public constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y)
        this.img = img;
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
        ctx.drawImage(this.img, this.xPos, this.yPos, this.img.width, this.img.height);
        ctx.drawImage(this.img, this.xPos, this.yPos, this.img.width, this.img.height);
    }
}