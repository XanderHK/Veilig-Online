/// <reference path="GameEntity.ts"/>
class Enemy extends GameEntity {

    public static readonly SPRITES = ["enemy.png", "enemy2.png"]

    private img: HTMLImageElement[];
    private _question: string;
    private _answer: string;

    public constructor(x: number, y: number, sprites: HTMLImageElement[], question: string, answer: string) {
        super(x, y, 0, 0);
        this.img = sprites;
        this._question = question;
        this._answer = answer;
    }

    /**
    * Gets the sprite of the object
    */
    public get sprite(): HTMLImageElement {
        return this.img[0];
    }

    public get question(): string {
        return this._question;
    }


    public get answer(): string {
        return this._answer;
    }

    /**
    * Draws the object
    * @param {CanvasRenderingContext2D} ctx
    */
    public draw(ctx: CanvasRenderingContext2D, state: number) {
        ctx.drawImage(this.img[state], this.xPos, this.yPos, this.img[state].width, this.img[state].height);
    }
}