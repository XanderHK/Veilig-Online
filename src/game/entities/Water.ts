/// <reference path="GameEntity.ts"/>
class Water extends GameEntity {

    public static readonly SPRITE = [""];

    private img: HTMLImageElement;

    public constructor(x: number, y: number, sprite: HTMLImageElement) {
        super(x, y, 0, 0);
        this.img = sprite;
    }

    public get sprite(): HTMLImageElement {
        return this.img;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos)
    }
}