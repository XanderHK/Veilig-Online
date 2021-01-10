/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    private keyboardListener: KeyboardListener;
    private lastFrameAfterJump: number;
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private _score: number = 0;

    protected _name: string;

    protected blocks: Block[] = []
    protected water: Water[] = [];
    protected coins: Coin[] = [];
    protected spikes: Spike[] = [];
    protected enemies: Enemy[] = [];
    protected infoObjects: InfoObject[] = [];
    protected player: Player;


    /**
     * Constructs the level logic
     * @param {Config} config 
     * @param {ImageLoader} repo 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo, width, height);
        const entries: [string, any][] = Object.entries(config);
        this.initializePlatforms(entries);
        this.initializeCoins();
        this.initializeWater(entries);
        this.initializeSpikes(entries);
        this.keyboardListener = new KeyboardListener();

        const playerSprites: HTMLImageElement[] = Player.PLAYER_SPRITES.map((key: string) => this.repo.getImage(key))
        this.player = new Player(this.blocks[0].xPos, this.blocks[0].yPos - this.repo.getImage("main_char_1").height, 8, 10, playerSprites);

    }

    public get name(): string {
        return this._name;
    }

    /**
     * Method that creates all the blocks
     * @param {[string, any][]} entries 
     */
    private initializePlatforms(entries: [string, any][]) {
        const tileSprite = this.repo.getImage("tile");
        this._name = String(entries.find((entry) => entry[0] === "name")[1]);
        Object.values(entries.find(entry => entry[0] === "platforms")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }, i: number) => {
            const amountOfTiles = Math.floor((settings.xEnd - settings.xStart) / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite))
                settings.xStart += tileSprite.width;
            }
        });
    }

    private initializeWater(entires: [string, any][]) {
        const waterSprite = this.repo.getImage("water");
        Object.values(entires.find(entry => entry[0] === "water")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }) => {
            const amountOfWaterTiles = Math.ceil((settings.xEnd - settings.xStart) / waterSprite.width);
            for (let i = 0; i < amountOfWaterTiles; i++) {
                this.water.push(new Water(settings.xStart, settings.yStart, waterSprite));
                settings.xStart += waterSprite.width;
            }
        })
    }

    private initializeCoins() {
        const coinSprite = this.repo.getImage("coin");
        this.blocks.forEach((possibleSpawnBlock: Block) => {
            if (Math.round(Math.random()) === 1) {
                this.coins.push(new Coin(possibleSpawnBlock.xPos, possibleSpawnBlock.yPos - coinSprite.height, coinSprite))
            }
        })
    }

    /**
     * 
     * @param entries 
     */
    private initializeSpikes(entries: [string, any][]) {

    }

    /**
     * Collision method that checks if something collides with something else (e.g. player and coins)
     */
    private fullCollision(entities: GameEntity[]) {
        // Collision detection of objects and player
        // Use the bounding box detection method: https://computersciencewiki.org/index.php/Bounding_boxes
        const bools: [boolean, number][] = entities.map((entity: GameEntity, i: number) => {
            const statement: boolean = (entity.xPos < this.player.xPos + this.repo.getImage("main_char_1").width
                && entity.xPos > this.player.xPos
                && entity.yPos < this.player.yPos + this.repo.getImage("main_char_1").height
                && entity.yPos + this.repo.getImage("tile").height > this.player.yPos);
            return [statement, i]
        })
        const result = bools.find(bool => bool[0] === true);
        return result === undefined ? [false, null] : result
    }

    private collidesWithCoin() {
        const coinCollisionResult = this.fullCollision(this.coins);
        if (coinCollisionResult[0]) {
            const coinIndex: number = coinCollisionResult[1] as number
            this._score += this.coins[coinIndex].score;
            this.coins.splice(coinIndex, 1);

        }
    }

    /**
     * Method that checks if the player is ontop of a block
     */
    private collidesWithTopOfBlock() {
        return this.blocks.map(block => {
            return this.collidesWithSide(this.player, block)
        }).find(side => side === CollisionState.Top) === undefined ? false : true;
    }

    /**
     * Method that checks if the player is colliding with any side besides the top of the block
     */
    private collidesWithLeftRightOrBottom() {
        const side = this.blocks.map(block => {
            return this.collidesWithSide(this.player, block);
        }).find(side => side === CollisionState.Bottom || side === CollisionState.Left || side === CollisionState.Right)

        const boolValue = side === undefined ? true : false;
        return [side, boolValue]
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

    /**
     * changes the player image
     * @param {number} start 
     * @param {number} end 
     */
    private changePlayerSprite(start: number, end: number) {
        if (this.animate(166)) {
            if (this.currentPlayerImgIndex.state !== start) {
                this.currentPlayerImgIndex.state = start;
            } else {
                this.currentPlayerImgIndex.state = end;
            }
        }
    }

    /**
     * returns the current image index from Player.SPRITES
     */
    protected get playerImageIndex(): number {
        return this.currentPlayerImgIndex.state;
    }

    /**
     * Checks if the player hits the bottom of the screen
     */
    private hitsBottom() {
        return this.player.yPos + this.repo.getImage("main_char_1").height >= this.height;
    }

    /**
     * Method that makes the player jump and delays the next jump
     */
    private makePlayerJump() {
        const timeIntervalInFrames = window.fps / 2;
        if (this.lastFrameAfterJump === undefined || this.frames > this.lastFrameAfterJump + timeIntervalInFrames) {
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
                this.lastFrameAfterJump = this.frames;
                this.player.jump();
            }
        } else if (this.frames < this.lastFrameAfterJump + timeIntervalInFrames / 3) {
            this.player.jump();
        }
    }

    /**
     * Method that executes what the player needs to do while idle.
     */
    private idlePlayer() {
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !(this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT))) {
            this.changePlayerSprite(0, 1);
        }
    }

    /**
     * Method checks if the player needs to fall
     * @param {boolean} collidesWithStandableSide 
     */
    private makePlayerFall(collidesWithStandableSide: boolean) {
        if (!collidesWithStandableSide) {
            if (!this.hitsBottom()) {
                this.player.gravity();
            } else {
                this.player.xPos = this.blocks[0].xPos + this.repo.getImage("main_char_1").width;
                this.player.yPos = this.blocks[0].yPos - this.repo.getImage("main_char_1").height;
            }
        }
    }

    /**
     * Method that executes the logic that needs to be done while the player is moving left
     * @param {boolean} collidesWithNoneStandableSide 
     */
    private movePlayerLeft(collidesWithNoneStandableSide: (boolean | CollisionState)[]) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT)) {
            if (collidesWithNoneStandableSide[0] !== CollisionState.Right) {
                this.player.move(false);
                this.changePlayerSprite(2, 7);
            }

        }
    }

    /**
     *  Method that executes the logic that needs to be done while the player is moving right
     * @param {boolean} collidesWithNoneStandableSide 
     */
    private movePlayerRight(collidesWithNoneStandableSide: (boolean | CollisionState)[]) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT)) {
            if (collidesWithNoneStandableSide[0] !== CollisionState.Left) {
                this.player.move(true);
                this.changePlayerSprite(8, 13);
            }
        }
    }


    public get score(): number {
        return this._score;
    }

    /**
     * Bundle method that invokes every player movement related method
     */
    protected movePlayer() {
        const collidesWithStandableSide: boolean = this.collidesWithTopOfBlock();
        const collidesWithNoneStandableSide = this.collidesWithLeftRightOrBottom();
        this.collidesWithCoin();
        this.movePlayerRight(collidesWithNoneStandableSide);
        this.movePlayerLeft(collidesWithNoneStandableSide);
        this.makePlayerFall(collidesWithStandableSide);
        this.idlePlayer();
        this.makePlayerJump();
    }
}
