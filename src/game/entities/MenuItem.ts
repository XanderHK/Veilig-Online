/// <reference path="GameEntity.ts"/>
class MenuItem extends GameEntity {

    private image: HTMLImageElement

    public constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y);
        this.image = img;
    }

    /**
    * Gets the sprite of the object
    */
    public get sprite(): HTMLImageElement {
        return this.image;
    }

    /**
    * Draws the object
    * @param {CanvasRenderingContext2D} ctx
    */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.xPos, this.yPos, this.image.width, this.image.height);
    }

}