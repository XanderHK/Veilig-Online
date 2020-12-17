class Speaker extends GameEntity {


    public constructor(x: number, y: number, velocity: number, img: string) {
        super(x, y, velocity, img);
    }

    public draw(ctx: CanvasRenderingContext2D, state: number) {
        const sprite: HTMLImageElement = this.getSprites(state) as HTMLImageElement;
        ctx.drawImage(sprite, this.xPos, this.yPos);
    }
}