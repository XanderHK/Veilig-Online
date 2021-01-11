class MenuItem extends GameEntity {

    private image: HTMLImageElement

    public constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y);
        this.image = img;
    }

    public get sprite(): HTMLImageElement {
        return this.image;
    }

    /**
     * 
     * @param ctx 
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.xPos, this.yPos)
    }

}