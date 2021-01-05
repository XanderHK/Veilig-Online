/// <reference path="GameEntity.ts"/>
class Block extends GameEntity {
    private img: HTMLImageElement;

    public constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y)
        this.img = img;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
}