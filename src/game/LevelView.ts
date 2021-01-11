/// <reference path="LevelLogic.ts"/>
class LevelView extends LevelLogic {

    private ctx: CanvasRenderingContext2D;
    private scoreText: TextString;
    private lifeText: TextString;

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
        this.scoreText = new TextString(this.width - this.ctx.measureText("Score 0000").width, this.height / 10 * 1, "Score " + String(0));
        this.lifeText = new TextString(this.width - this.ctx.measureText("Lives 0000").width, this.height / 10 * 2, "Lives " + String(Game.AMOUNT_OF_LIVES))
    }

    /**
     * Invokes all the seperate draw methods
     */
    public drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.drawCoins();
        this.drawEnemies();
        this.playerActions();
        this.drawPlayer();
        this.drawWater();
        this.drawScore();
        this.drawInfo();
        this.drawInfoScreen();
        this.drawLives();
    }

    /**
     * Method that draws the background
     */
    private drawBackGround() {
        const background = this.repo.getImage("Background_level1");
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }

    private drawInfo() {
        this.drawEntities(this.infoObjects);
    }

    private drawScore() {
        this.scoreText.fillStyle = "white";
        this.scoreText.text = "Score " + String(this.score);
        this.scoreText.drawText(this.ctx);
    }

    private drawLives() {
        this.lifeText.fillStyle = "white";
        this.lifeText.text = "Lives " + String(this.lives);
        this.lifeText.drawText(this.ctx);
    }

    private drawCoins() {
        this.drawEntities(this.coins)
    }

    private drawWater() {
        this.drawEntities(this.water)
    }

    private drawEnemies() {
        this.drawEntities(this.enemies)
    }

    private drawInfoScreen() {
        const result = this.interactsWithInfo();
        if (this.window && result[0]) {
            const index: number = result[1] as number;
            const infoObject = this.infoObjects[index]
            const answer = infoObject.answer;
            const question = infoObject.question;

            const cy = this.height / 2 - 100;
            const cx = this.width / 2 - 100;
            const questionObj: TextString = new TextString(cx, cy + 50, question)
            const answerObj = new TextString(cx, cy + 150, answer)

            this.ctx.font = `${questionObj.fontSize}px ${questionObj.font}`;
            const answerWidth = this.ctx.measureText(answer).width;
            const questionWidth = this.ctx.measureText(question).width;

            const width = answerWidth >= questionWidth ? answerWidth : questionWidth;

            this.ctx.fillStyle = "white";
            this.ctx.fillRect(cx - width, cy, width * 2, 200)
            questionObj.drawText(this.ctx);
            answerObj.drawText(this.ctx);
        }
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
