class Player extends GameEntity {

    public static readonly PLAYER_SPRITES = [Game.IMG_PATH + `player/main_char_1.png`, Game.IMG_PATH + `player/main_char_2.png`];

    public constructor(x: number, y: number, velocity: number) {
        super(x, y, velocity, Player.PLAYER_SPRITES);
    }

    public draw(ctx: CanvasRenderingContext2D, state: number) {
        const sprite: HTMLImageElement = this.getSprites(state) as HTMLImageElement;
        ctx.drawImage(sprite, this.xPos, this.yPos);
    }
}