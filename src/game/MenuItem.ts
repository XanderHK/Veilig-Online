class MenuItem extends GameEntity {

    public static readonly MENU_SPRITES = [Game.IMG_PATH + "level1.png", Game.IMG_PATH + "level2.png", Game.IMG_PATH + "level3.png"];
    public static readonly DIMENSIONS = { width: 281, height: 75 };

    public constructor(x: number, y: number, imgIndex: number) {
        const src = MenuItem.MENU_SPRITES[imgIndex];
        super(x, y, 0, src, MenuItem.DIMENSIONS);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.getSprites(0), this.xPos, this.yPos)
    }

}