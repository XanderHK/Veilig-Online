/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    private keyboardListener: KeyboardListener;
    private lastFrameAfterJump: number;

    protected name: string;

    protected width: number;
    protected height: number;

    protected blocks: Block[] = []
    protected spikes: Spike[] = [];
    protected player: Player;


    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo);
        this.height = height;
        this.width = width;
        const entries: [string, any][] = Object.entries(config);
        this.initializePlatforms(entries);
        this.initializeSpikes(entries);
        this.keyboardListener = new KeyboardListener();

        const playerSprites: HTMLImageElement[] = Player.PLAYER_SPRITES.map((key: string) => this.repo.getImage(key))
        this.player = new Player(this.blocks[0].xPos, this.blocks[0].yPos - this.repo.getImage("main_char_1").height, 8, 10, playerSprites);

    }

    private initializePlatforms(entries: [string, any][]) {
        const tileSprite = this.repo.getImage("tile");
        this.name = String(entries.find((entry) => entry[0] === "name")[1]);
        Object.values(entries.find(entry => entry[0] === "platforms")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }, i: number) => {
            const amountOfTiles = Math.floor((settings.xEnd - settings.xStart) / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite))
                settings.xStart += tileSprite.width;
            }
        });
    }

    private initializeSpikes(entries: [string, any][]) {

    }

    private playerCollidesWithBlock() {
        // Collision detection of objects and player
        // Use the bounding box detection method: https://computersciencewiki.org/index.php/Bounding_boxes
        const bools = this.blocks.map(block => {
            const statement: boolean = (block.xPos < this.player.xPos + this.repo.getImage("main_char_1").width
                && block.xPos > this.player.xPos
                && block.yPos < this.player.yPos + this.repo.getImage("main_char_1").height
                && block.yPos + this.repo.getImage("tile").height > this.player.yPos);
            return statement
        })
        return bools.find(bool => bool === true) === undefined ? false : true
    }


    private collidesWithSideOfBlock() {
        return this.blocks.map(block => {
            return this.collidesWithSide(this.player, block)
        }).find(side => side === CollisionState.Top) === undefined ? true : false;
    }

    /**
     * Checks if the player collides with a side of a GameEntity
     * @param {Player} player 
     * @param {GameEntity} entity 
     */
    private collidesWithSide(player: Player, entity: GameEntity) {
        const dx: number = (player.xPos + this.repo.getImage("main_char_1").width / 2) - (entity.xPos + this.repo.getImage("tile").width / 2);
        const dy: number = (player.yPos + this.repo.getImage("main_char_1").height / 2) - (entity.yPos + this.repo.getImage("tile").height / 2);
        const width: number = (this.repo.getImage("main_char_1").width + this.repo.getImage("tile").width) / 2;
        const height: number = (this.repo.getImage("main_char_1").height + this.repo.getImage("tile").height) / 2;
        const crossWidth: number = width * dy;
        const crossHeight: number = height * dx;
        let collision: CollisionState = CollisionState.None;
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                collision = (crossWidth > (-crossHeight)) ? CollisionState.Bottom : CollisionState.Left;
            } else {
                collision = (crossWidth > -(crossHeight)) ? CollisionState.Right : CollisionState.Top;
            }
        }
        return (collision);
    }

    protected movePlayer() {
        const collidesWithNoneStandableSide: boolean = this.collidesWithSideOfBlock();
        if (collidesWithNoneStandableSide) {
            this.player.gravity();
        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.player.xPos > -1) {
            this.player.move(true);
        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.player.xPos > 0) {
            this.player.move(false);
        }

        // 500 ms 
        const timeIntervalInFrames = window.fps / 2
        if (this.lastFrameAfterJump === undefined || this.frames > this.lastFrameAfterJump + timeIntervalInFrames) {
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
                this.lastFrameAfterJump = this.frames;
                this.player.jump();
            }
        } else if (this.frames < this.lastFrameAfterJump + timeIntervalInFrames / 3) {
            this.player.jump();
        }
    }

}
