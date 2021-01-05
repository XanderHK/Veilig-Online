class Player extends GameEntity {

    public static readonly PLAYER_SPRITES = [`main_char_1.png`, `main_char_2.png`];

    private images: HTMLImageElement[];

    public constructor(x: number, y: number, velocityX: number, velocityY: number, sprites: HTMLImageElement[]) {
        super(x, y, velocityX, velocityY);
        this.images = sprites;

    }

    public move(direction: boolean) {
        const nextXPos = this.xPos + (direction ? this.velocityX : -this.velocityX);
        this.xPos = nextXPos;

    }
    public jump() {
        this.yPos -= this.velocityY;
    }

    public gravity() {
        this.yPos += this.velocityY / 2;
    }

    public draw(ctx: CanvasRenderingContext2D, state: number) {
        ctx.drawImage(this.images[state], this.xPos, this.yPos);
    }
}