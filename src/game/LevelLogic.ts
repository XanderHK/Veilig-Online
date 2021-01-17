/// <reference path="Logic.ts"/>
abstract class LevelLogic extends Logic {

    private keyboardListener: KeyboardListener;
    private lastFrameAfterJump: number;
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private currentEnemyImgIndex: { state: number } = { state: 0 };
    private _score: number = 0;
    private _lives: number = Game.AMOUNT_OF_LIVES;
    private _name: string;


    protected blocks: Block[] = []
    protected water: Water[] = [];
    protected coins: Coin[] = [];
    protected spikes: Spike[] = [];
    protected enemies: Enemy[] = [];
    protected infoObjects: InfoObject[] = [];
    protected player: Player;
    protected window: boolean = false;
    protected entries: [string, any][];
    protected backgroundImage: HTMLImageElement;
    protected tileKey: string;


    /**
     * Constructs the level logic
     * @param {Config} config 
     * @param {ImageLoader} repo 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo, width, height);
        this.entries = Object.entries(config);
        this.backgroundImage = this.repo.getImage(this.entries.find(e => e[0] === "background")[1])
        this.tileKey = this.entries.find(e => e[0] === "tile")[1];
        this.initializeEntities();
        this.keyboardListener = new KeyboardListener();
        const playerSprites: HTMLImageElement[] = Player.PLAYER_SPRITES.map((key: string) => this.repo.getImage(key))
        this.player = new Player(this.blocks[0].xPos, this.blocks[0].yPos - this.repo.getImage("main_char_1").height, 8, 10, playerSprites);
    }


    /**
     * Method that bundles method together
     */
    private initializeEntities() {
        this.initializePlatforms();
        this.initializeCoins();
        this.initializeWater();
        this.initializeInfo();
        this.initializeEnemies();
    }

    /**
     * Method that creates all the blocks
     */
    private initializePlatforms() {
        const tileSprite = this.repo.getImage(this.tileKey);
        this._name = String(this.entries.find((entry) => entry[0] === "name")[1]);
        Object.values(this.entries.find(entry => entry[0] === "platforms")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }, i: number) => {

            settings.yStart = Calculate.calculateY(settings.yStart);
            settings.xStart = Calculate.calculateX(settings.xStart)
            settings.xEnd = Calculate.calculateX(settings.xEnd)

            const amountOfTiles = Math.round((settings.xEnd - settings.xStart) / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite))
                settings.xStart += tileSprite.width;
            }
        });
    }

    /**
     * Method that initializes all the water entities
     */
    private initializeWater() {
        const waterSprite = this.repo.getImage("water");
        Object.values(this.entries.find(entry => entry[0] === "water")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }) => {
            const amountOfWaterTiles = Math.ceil((settings.xEnd - settings.xStart) / waterSprite.width);
            for (let i = 0; i < amountOfWaterTiles; i++) {
                this.water.push(new Water(settings.xStart, settings.yStart, waterSprite));
                settings.xStart += waterSprite.width;
            }
        })
    }

    /**
     * Method that initializes all the coins
     */
    private initializeCoins() {
        const coinSprite = this.repo.getImage("coin");
        this.blocks.forEach((possibleSpawnBlock: Block) => {
            const coin = new Coin(possibleSpawnBlock.xPos, possibleSpawnBlock.yPos - coinSprite.height - 5, coinSprite)
            if (Math.round(Math.random()) === 1 && this.fullCollision(this.blocks, coin)[0] === false) {
                this.coins.push(coin);
            }
        })
    }

    /**
 * Initializes the enemy objects that should be drawn on the canvas
 */
    private initializeEnemies() {
        const info: { answer: string, question: string }[] = this.entries.find(entry => entry[0] === "questions")[1]
        for (let i = 0; i < Game.AMOUNT_OF_ENEMIES; i++) {
            const enemySprites: HTMLImageElement[] = Enemy.SPRITES.map((key: string) => this.repo.getImage(key))
            const randomIndex: number = Math.floor(Math.random() * this.blocks.length);
            const randomSpawn: Block = this.blocks[randomIndex];
            const newEnemyObj: Enemy = new Enemy(randomSpawn.xPos, randomSpawn.yPos - enemySprites[0].height, enemySprites, info[i].question, info[i].answer);
            this.enemies.push(newEnemyObj)
        }
    }


    /**
 * Initializes the info objects that should be drawn on the canvas
 */
    private initializeInfo() {
        const infoSprite: HTMLImageElement = this.repo.getImage("info");
        const info: { answer: string, question: string }[] = this.entries.find(entry => entry[0] === "questions")[1]
        const tempInfoArr: InfoObject[] = [];
        for (let i = 0; i < Game.AMOUNT_OF_INFO; i++) {
            const randomIndex: number = Math.floor(Math.random() * this.blocks.length);
            const randomSpawn: Block = this.blocks[randomIndex];
            const newInfoObj: InfoObject = new InfoObject(randomSpawn.xPos, randomSpawn.yPos - randomSpawn.sprite.height, infoSprite, info[i].question, info[i].answer);
            tempInfoArr.push(newInfoObj);
        }
        const retry: boolean = tempInfoArr.map(temp => {
            return this.fullCollision(this.blocks, temp)[0]
        }).find(e => e === true)
        if (retry) {
            this.initializeInfo()
        } else {
            tempInfoArr.forEach(infoObj => this.infoObjects.push(infoObj))
        }
    }

    /**
     * Collision method that checks if something collides with something else (e.g. player and coins)
     */
    private fullCollision(entities: GameEntity[], compareEntity: GameEntity) {
        // Collision detection of objects and player
        // Use the bounding box detection method: https://computersciencewiki.org/index.php/Bounding_boxes
        const bools: [boolean, number][] = entities.map((entity: GameEntity, i: number) => {
            const statement: boolean = (entity.xPos <= compareEntity.xPos + compareEntity.sprite.width
                && entity.xPos + entity.sprite.width >= compareEntity.xPos
                && entity.yPos <= compareEntity.yPos + compareEntity.sprite.height
                && entity.yPos + entity.sprite.height >= compareEntity.yPos);
            return [statement, i]
        })
        const result = bools.find(bool => bool[0] === true);

        return result === undefined ? [false, null] : result
    }

    /**
     * Method that checks if the player collides with the coin
     */
    private collidesWithCoin() {
        const coinCollisionResult = this.fullCollision(this.coins, this.player);
        if (coinCollisionResult[0]) {
            const coinIndex: number = coinCollisionResult[1] as number
            this._score += this.coins[coinIndex].score;
            this.coins.splice(coinIndex, 1);
        }
    }

    /**
     * Method that checks if the player is ontop of a block
     */
    private collidesWithTopOfBlock(): boolean {
        return this.blocks.map(block => {
            return this.collidesWithSide(this.player, block)
        }).find(side => side === CollisionState.Top) === undefined ? false : true;
    }

    /**
     * Method that checks if the player is colliding with any side besides the top of the block
     */
    private collidesWithLeftRightOrBottom(): (boolean | CollisionState)[] {
        const side = this.blocks.map(block => {
            return this.collidesWithSide(this.player, block);
        }).find(side => side === CollisionState.Bottom || side === CollisionState.Left || side === CollisionState.Right)

        const boolValue = side === undefined ? true : false;
        return [side, boolValue]
    }



    /**
     * Checks if the entity collides with a side of a GameEntity
     * @param {entity} entity 
     * @param {GameEntity} entity 
     */
    private collidesWithSide(entity: GameEntity, compareEntity: GameEntity) {
        const dx: number = (entity.xPos + entity.sprite.width / 2) - (compareEntity.xPos + compareEntity.sprite.width / 2);
        const dy: number = (entity.yPos + entity.sprite.height / 2) - (compareEntity.yPos + compareEntity.sprite.height / 2);
        const width: number = (entity.sprite.width + compareEntity.sprite.width) / 2;
        const height: number = (entity.sprite.height + compareEntity.sprite.height) / 2;
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
     * Checks if the player hits the bottom of the screen
     */
    private hitsBottom() {
        return this.player.yPos + this.repo.getImage("main_char_1").height >= this.height;
    }

    /**
     * Method that makes the player jump and delays the next jump
     */
    private makePlayerJump(collidesWithNoneStandableSide: (boolean | CollisionState)[]) {
        const timeIntervalInFrames = window.fps / 2;
        if (this.lastFrameAfterJump === undefined || this.frames > this.lastFrameAfterJump + timeIntervalInFrames) {
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
                this.lastFrameAfterJump = this.frames;
                this.player.jump();
            }
        } else if (this.frames < this.lastFrameAfterJump + timeIntervalInFrames / 3) {
            if (collidesWithNoneStandableSide[0] !== CollisionState.Bottom) {
                this.player.jump();
            }
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
     * Method that checks if the player hits the side of the canvas
     */
    private hitsSide() {
        return this.player.xPos + this.repo.getImage("main_char_1").width <= -30;
    }

    /**
     * Method checks if the player needs to fall
     * @param {boolean} collidesWithStandableSide 
     */
    private makePlayerFall(collidesWithStandableSide: boolean) {
        if (!collidesWithStandableSide) {
            if (!this.hitsBottom() && !this.hitsSide()) {
                this.player.gravity();
                this.putPlayerOnTop();
            } else {
                this._lives--;
                this.player.xPos = this.blocks[0].xPos + this.repo.getImage("main_char_1").width;
                this.player.yPos = this.blocks[0].yPos - this.repo.getImage("main_char_1").height;
            }
        }
    }
    /**
     * Method to put the player ontop of the block after falling (mainly necessary for resolutions lower than 1920)
     */
    private putPlayerOnTop() {
        const result = this.fullCollision(this.blocks, this.player);
        if (this.collidesWithTopOfBlock() && result[0] !== false && this.collidesWithLeftRightOrBottom()[1]) {
            const block: Block = this.blocks[result[1] as number]
            this.player.yPos = block.yPos - this.player.sprite.height;
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

    /**
   * Bundle method that invokes every player movement related method
   */
    private playerActions() {
        const collidesWithStandableSide: boolean = this.collidesWithTopOfBlock();
        const collidesWithNoneStandableSide = this.collidesWithLeftRightOrBottom();
        this.collidesWithCoin();
        this.movePlayerRight(collidesWithNoneStandableSide);
        this.movePlayerLeft(collidesWithNoneStandableSide);
        this.makePlayerFall(collidesWithStandableSide);
        this.idlePlayer();
        this.makePlayerJump(collidesWithNoneStandableSide);
    }

    /**
     * Method that gives the object info when interacting with the info object
     */
    protected interactsWithInfo(): InfoObject {
        const result = this.fullCollision(this.infoObjects, this.player);
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER) && result[0]) {
            this.window = true;
            return this.infoObjects[result[1] as number]
        } else if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_Q) && this.fullCollision(this.infoObjects, this.player)) {
            this.window = false;
            return this.infoObjects[result[1] as number]
        }
        return this.infoObjects[result[1] as number]

    }

    /**
     * Method that gives the object info when interacting with the enemy object
     */
    protected interactsWithEnemy(): Enemy {
        const result = this.fullCollision(this.enemies, this.player);
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER) && result[0]) {
            this.window = true;
            return this.enemies[result[1] as number]
        } else if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_Q) && this.fullCollision(this.infoObjects, this.player)) {
            this.window = false;
            return this.enemies[result[1] as number]
        }
        return this.enemies[result[1] as number]

    }

    /**
     * Method that either removes a live or the enemy depending if the answer is correct or not
     * @param {Enemy} enemy 
     */
    protected answerEnemy(enemy: Enemy) {
        const a: boolean = this.keyboardListener.isKeyDown(KeyboardListener.KEY_A);
        const b: boolean = this.keyboardListener.isKeyDown(KeyboardListener.KEY_B);

        if (a || b) {
            const answer = (a && !b) ? "JA" : ((!a && b) ? "NEE" : undefined)
            if (enemy.answer === answer && answer !== undefined) {
                this.enemies.splice(this.enemies.indexOf(enemy), 1)
                this.window = false;
            } else if (answer !== undefined && enemy.answer !== answer) {
                if (this.window === true) {
                    this._lives--;
                }
                this.window = false;
            }
        }
    }

    /**
     * Changes the index every so often
     * @param {number} start 
     * @param {number} end 
     */
    protected changeEnemySprite(start: number, end: number) {
        if (this.animate(250)) {
            if (this.currentEnemyImgIndex.state !== start) {
                this.currentEnemyImgIndex.state = start;
            } else {
                this.currentEnemyImgIndex.state = end;
            }
        }
    }

    /**
     * Returns the index from Enemy.SPRITES which will be used to draw the correct enemy sprite
     */
    protected get enemyImageIndex(): number {
        return this.currentEnemyImgIndex.state;
    }


    /**
     * returns the current image index from Player.SPRITES
     */
    protected get playerImageIndex(): number {
        return this.currentPlayerImgIndex.state;
    }

    protected actions() {
        this.playerActions();
        this.changeEnemySprite(0, 1);
    }

    /**
     * Method that returns true if you have no more attempts
     */
    public isComplete() {
        return this.enemies.length === 0
    }

    /**
     * Getter for the score
     */
    public get score(): number {
        return this._score;
    }

    /**
     * Getter for the lives
     */
    public get lives(): number {
        return this._lives;
    }

    /**
  * Returns the value of the name property
  */
    public get name(): string {
        return this._name;
    }
}
