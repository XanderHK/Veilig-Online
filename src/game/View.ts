/// <reference path="Level.ts"/>
class View extends Level {

    private ctx: CanvasRenderingContext2D;

    private currentPlayerImgIndex: { state: number } = { state: 0 };


    public constructor(config: Config, ctx: CanvasRenderingContext2D, repo: ImageLoader, width: number, height: number) {
        super(config, repo, width, height);
        this.ctx = ctx;
    }

    public drawLevel() {
        this.blocks.forEach((block: Block) => {
            block.draw(this.ctx);
        })
        this.movePlayer();
        this.drawPlayer();
    }

    private drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        this.player.draw(this.ctx, next)
    }
}
