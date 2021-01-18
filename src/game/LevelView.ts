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
        this.scoreText = new TextString(this.width / 10 * 0.5 + this.ctx.measureText("Score 0000").width, this.height / 10 * 1, "Score " + String(0));
        this.lifeText = new TextString(this.width / 10 * 0.5 + this.ctx.measureText("Lives 0000").width, this.height / 10 * 2, "Lives " + String(Game.AMOUNT_OF_LIVES))
    }

    /**
     * Invokes all the seperate draw methods
     */
    public drawLevel() {
        this.drawBackGround();
        this.drawBlocks();
        this.drawCoins();
        this.drawEnemies();
        this.actions();
        this.drawPlayer();
        this.drawWater();
        this.drawScore();
        this.drawInfo();
        this.drawInfoScreen();
        this.drawEnemyScreen();
        this.drawLives();
    }

    /**
     * Method that draws the background
     */
    private drawBackGround() {
        this.ctx.drawImage(this.backgroundImage, (this.width / 2) - (this.backgroundImage.width / 2), (this.height / 2) - (this.backgroundImage.height / 2), this.backgroundImage.width, this.backgroundImage.height);
    }

    /**
     * Draws the info objects
     */
    private drawInfo() {
        this.drawEntities(this.infoObjects);
    }

    /**
     * Draws the score text
     */
    private drawScore() {
        this.scoreText.x
        this.scoreText.fillStyle = "white";
        this.scoreText.text = "Score " + String(this.score);
        this.scoreText.drawText(this.ctx);
    }

    /**
     * Draws the life text
     */
    private drawLives() {
        this.lifeText.fillStyle = "white";
        this.lifeText.text = "Lives " + String(this.lives);
        this.lifeText.drawText(this.ctx);
    }

    /**
     * Draws all the coins
     */
    private drawCoins() {
        this.drawEntities(this.coins)
    }

    /**
     * Draws all the water
     */
    private drawWater() {
        this.drawEntities(this.water)
    }

    /**
     * Draws all the enemies
     */
    private drawEnemies() {
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx, this.enemyImageIndex)
        })
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

    /**
     * Method that draws the dialogue screen for the infopoints
     */
    private drawInfoScreen() {
        const result = this.interactsWithInfo();
        if (this.window && result !== undefined) {
            const question = result.question;
            // todo add the textstring in the infoobject class same for enemy
            const questionObj: TextString = new TextString(this.cx, this.cy + 50, question)
            questionObj.fontSize = 24;

            this.ctx.font = `${questionObj.fontSize}px ${questionObj.font}`;
            const questionWidth = this.ctx.measureText(question).width;

            this.ctx.fillStyle = "white";
            this.ctx.fillRect(this.cx - questionWidth, this.cy, questionWidth * 2, 200)
            questionObj.drawText(this.ctx);
        }
    }

    /**
     * Method that draws the dialogue screen for the enemy
     */
    private drawEnemyScreen() {
        const result = this.interactsWithEnemy();
        if (this.window && result !== undefined) {
            const question = result.question;
            const questionObj: TextString = new TextString(this.cx, this.cy + 50, question);
            questionObj.fontSize = 24;

            this.ctx.font = `${questionObj.fontSize}px ${questionObj.font}`;
            const questionWidth = this.ctx.measureText(question).width;

            this.ctx.fillStyle = "white";
            this.ctx.fillRect(this.cx - questionWidth, this.cy, questionWidth * 2, 200);
            ["JA", "NEE"].reduce((a, r) => {
                new TextString(this.cx, this.cy + a, r).drawText(this.ctx);
                a += 50;
                return a;
            }, 100)

            this.answerEnemy(result);
            questionObj.drawText(this.ctx);
        }
    }

}
