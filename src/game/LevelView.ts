/// <reference path="Level.ts"/>
class LevelView extends Level {

    private ctx: CanvasRenderingContext2D;
    private scoreText: TextString;

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
        this.scoreText = new TextString(this.width - this.ctx.measureText("0000").width, 100, String(0));
    }

    /**
     * Invokes all the seperate draw methods
     */
    public drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.drawCoins();
        this.movePlayer();
        this.drawPlayer();
        this.drawWater();
        this.drawScore();
    }

    /**
     * Method that draws the background
     */
    private drawBackGround() {
        const background = this.repo.getImage("Background_level1");
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }

    private drawScore() {
        this.scoreText.fillStyle = "white";
        this.scoreText.text = String(this.score);
        this.scoreText.drawText(this.ctx);
    }

    private drawCoins() {
        this.drawEntities(this.coins)
    }

    private drawWater() {
        this.drawEntities(this.water)
    }


    /**
     * Method that draws all the blocks
     */
    private drawBlocks() {
        this.drawEntities(this.blocks)
    }

    private drawEntities(entities: GameEntity[]) {
        entities.forEach((entity: GameEntity) => {
            entity.draw(this.ctx)
        })
    }

    /**
     * Method that draws the player on the level view
     */
    private drawPlayer() {
        this.player.draw(this.ctx, this.playerImageIndex)
    }
}
