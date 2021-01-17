
/// <reference path="GameEntity.ts"/>
class Speaker extends GameEntity {

    //File names of the speaker sprites
    public static readonly SPEAKER_SPRITES = ["not-muted.png", "muted.png"];

    private image: HTMLImageElement;

    public constructor(x: number, y: number, velocity: number, img: HTMLImageElement) {
        super(x, y, velocity);
        this.image = img;
    }

    /**
    * Gets the sprite of the object
    */
    public get sprite() {
        return this.image;
    }

    /**
     * Draws the object
     * @param {CanvasRenderingContext2D} ctx
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.xPos, this.yPos, this.image.width, this.image.height);
    }
}