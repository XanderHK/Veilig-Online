class InfoObject extends GameEntity {

    private img: HTMLImageElement;
    private _question: string;
    private _answer: string;

    public constructor(x: number, y: number, sprite: HTMLImageElement, question: string, answer: string) {
        super(x, y, 0, 0);
        this.img = sprite;
        this._question = question;
        this._answer = answer;
    }

    public get sprite(): HTMLImageElement {
        return this.img;
    }

    public get answer(): string {
        return this._answer;
    }

    public get question(): string {
        return this._question;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.xPos, this.yPos)
    }
}