/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    private keyboardListener: KeyboardListener;

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
        this.player = new Player(this.blocks[0].xPos, this.blocks[0].yPos - this.repo.getImage("tile").height, 8, 10, playerSprites);

    }

    private initializePlatforms(entries: [string, any][]) {
        const tileSprite = this.repo.getImage("tile");
        this.name = String(entries.find((entry) => entry[0] === "name")[1]);
        Object.values(entries.find(entry => entry[0] === "platforms")[1]).forEach((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }, i: number) => {
            const amountOfTiles = Math.floor(settings.xEnd / tileSprite.width);
            for (let i = 0; i < amountOfTiles; i++) {
                this.blocks.push(new Block(settings.xStart, settings.yStart, tileSprite))
                settings.xStart += tileSprite.width;
            }
        });
    }

    private initializeSpikes(entries: [string, any][]) {

    }

    private playerIsOnBlock(): boolean {
        const isOnBlock: boolean[] = this.blocks.map((block: Block) => {
            const statement = this.player.xPos + this.repo.getImage("main_char_1").width > block.xPos + this.repo.getImage("tile").width
            return statement;
        })
        return (isOnBlock.find(bool => bool === false) === undefined ? true : false)
    }

    private playerIsAboveBlock(): boolean {
        const aboveBlock: boolean = this.blocks.map((block: Block) => {
            return this.player.yPos < block.yPos - this.repo.getImage("tile").height
        }).every(e => e === true);

        return aboveBlock;
    }


    protected movePlayer() {
        const onBlock: boolean = this.playerIsOnBlock();
        const aboveBlock: boolean = this.playerIsAboveBlock();

        if (onBlock || aboveBlock) {
            this.player.gravity();
        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.player.xPos > -1) {
            this.player.move(true);

        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.player.xPos > 0) {
            this.player.move(false);
        }


        if (!onBlock) {
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP) && this.player.xPos > 0) {
                this.player.jump();
            }
        }
    }

}
