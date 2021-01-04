/// <reference path="Level.ts"/>
class View extends Level {

    private ctx: CanvasRenderingContext2D;

    public constructor(config: Config, ctx: CanvasRenderingContext2D, repo: ImageLoader, width: number, height: number) {
        super(config, repo, width, height);
        this.ctx = ctx;
    }

    public drawLevel() {
        new TextString(this.width / 2, this.height / 2, this.name).drawText(this.ctx);
    }
}