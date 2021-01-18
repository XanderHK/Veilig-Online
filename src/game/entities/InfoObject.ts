/// <reference path="GameEntity.ts"/>
class InfoObject extends GameEntity {

    private img: HTMLImageElement;
    private _question: string;

    public constructor(x: number, y: number, sprite: HTMLImageElement, question: string) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._question = question;
    }

    /**
    * Gets the sprite of the object
    */
    public get sprite(): HTMLImageElement {
        return this.img;
    }

    public get question(): string {
        return this._question;
    }

    /**
    * Draws the object
    * @param {CanvasRenderingContext2D} ctx
    */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos, this.img.width, this.img.height);
    }
}