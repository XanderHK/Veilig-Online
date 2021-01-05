class Player extends GameEntity {

    public static readonly PLAYER_SPRITES = [`main_char_1.png`, `main_char_2.png`];

    private images: HTMLImageElement[];

    public constructor(x: number, y: number, velocity: number, sprites: HTMLImageElement[]) {
        super(x, y, velocity);
        this.images = sprites;
    }

    public move(value:number) {
        const nextXPos = this.xPos + (value);
        this.xPos = nextXPos;
        
    }
    public jump(value:number) {
        const nextHeight = this.yPos + (value);
        this.yPos = nextHeight;
        
    }
    public gravity(){
        const nextHeight = this.yPos - 10;
        this.yPos = nextHeight;
    }

    public draw(ctx: CanvasRenderingContext2D, state: number) {
        ctx.drawImage(this.images[state], this.xPos, this.yPos);
    }
}