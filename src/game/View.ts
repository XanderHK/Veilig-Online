/// <reference path="Level.ts"/>
class View extends Level {

    private ctx: CanvasRenderingContext2D;

    public constructor(config: Config, ctx: CanvasRenderingContext2D, repo: ImageLoader, width: number, height: number) {
        super(config, repo, width, height);
        this.ctx = ctx;
    }

    /**
     * 
     */
    public drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.movePlayer();
        this.drawPlayer();
    }

    private drawBackGround() {
        const background = this.repo.getImage("Background_level1");
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }


    /**
     * 
     */
    private drawBlocks() {
        this.blocks.forEach((block: Block) => {
            block.draw(this.ctx);
        });
    }

    /**
     * 
     */
    private drawPlayer() {
        this.player.draw(this.ctx, this.playerImageIndex)
    }
}
