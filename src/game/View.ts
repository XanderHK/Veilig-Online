/// <reference path="Level.ts"/>
class View extends Level {

    private ctx: CanvasRenderingContext2D;

    /**
     * Constructs the view of the level
     * @param {Config} config 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {ImageLoader} repo 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(config: Config, ctx: CanvasRenderingContext2D, repo: ImageLoader, width: number, height: number) {
        super(config, repo, width, height);
        this.ctx = ctx;
    }

    /**
     * Invokes all the seperate draw methods
     */
    public drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.movePlayer();
        this.drawPlayer();
    }

    /**
     * Method that draws the background
     */
    private drawBackGround() {
        const background = this.repo.getImage("Background_level1");
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }


    /**
     * Method that draws all the blocks
     */
    private drawBlocks() {
        this.blocks.forEach((block: Block) => {
            block.draw(this.ctx);
        });
    }

    /**
     * Method that draws the player on the level view
     */
    private drawPlayer() {
        this.player.draw(this.ctx, this.playerImageIndex)
    }
}
