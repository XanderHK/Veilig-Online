class Player extends GameEntity {

    public static readonly PLAYER_SPRITES = [Game.IMG_PATH + `player/main_char_1.png`, Game.IMG_PATH + `player/main_char_2.png`];

    private sprites: HTMLImageElement[] = [];

    public constructor(x: number, y: number, velocity: number) {
        super(x, y, velocity);
        this.sprites = Player.PLAYER_SPRITES.map((e) => {
            return new CreateImage(e).createImage()
        })
    }

    public getSprite(index: number): HTMLImageElement {
        return this.sprites[index];
    }

    public draw(ctx: CanvasRenderingContext2D, state: number) {
        ctx.drawImage(this.sprites[state], this.xPos, this.yPos);
    }
}