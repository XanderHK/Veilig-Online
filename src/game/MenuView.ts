/// <reference path="MenuLogic.ts"/>
class MenuView extends MenuLogic {

    private ctx: CanvasRenderingContext2D;
    private backgroundFrame: { frame: HTMLImageElement, key: string };

    public constructor(
        repo: ImageLoader,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,

    ) {
        super(width, height, repo);
        this.ctx = ctx;
        this.backgroundFrame = { frame: this.repo.getImage("0"), key: "0" };
    }

    /**
     * Draws the instructions uderneath of the earth
     */
    private drawInstructions() {
        const instructionText: string = "PRESS ENTER TO START LEVEL"
        const instructions: TextString = new TextString(this.width / 2, this.height / 2 + this.repo.getImage("earth").height, instructionText);
        instructions.fillStyle = "white";
        instructions.drawText(this.ctx);
    }

    /**
    * Method for drawing the player
    */
    private drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        const levelObjHeight = this.repo.getImage("level1").height;
        const playerPos = this.height / 10 * 2.3 + levelObjHeight;
        this.player.yPos = playerPos - this.repo.getImage(`main_char_${next + 1}`).height
        this.player.draw(this.ctx, next)
    }

    /**
   * Method for drawing the menu items
   */
    private drawMenuItems() {
        this.menuItems.forEach(menuItem => {
            menuItem.draw(this.ctx);
        })
    }
    /**
     * Method for drawing the speaker
     */
    private drawSpeaker() {
        const speakerSpriteIndex = this.audio ? 0 : 1;
        this.speakers[speakerSpriteIndex].draw(this.ctx);
    }

    /**
   * Method for drawing the background
   */
    private drawBackGround() {
        if (this.nextAnimation(3)) {
            this.backgroundFrame.key = String(Number(this.backgroundFrame.key) + 1);
            if (Number(this.backgroundFrame.key) >= MenuLogic.AMOUNT_OF_FRAMES) {
                this.backgroundFrame.key = String(0);
            }
            this.backgroundFrame.frame = this.repo.getImage(this.backgroundFrame.key);
        }
        const background = this.repo.getImage("earth");
        background.width = 300;
        background.height = 300;
        this.ctx.drawImage(this.backgroundFrame.frame, 0, 0, this.width, this.height)
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }

    /**
   * Draws the menu entirely 
   */
    public drawMenu() {
        this.mute();
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        this.drawInstructions();
    }
}