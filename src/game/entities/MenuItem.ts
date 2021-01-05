class MenuItem extends GameEntity {

    private image: HTMLImageElement

    public constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y);
        this.image = img;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.xPos, this.yPos)
    }

}