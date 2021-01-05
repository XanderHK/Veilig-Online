/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    public static readonly TILE_WIDTH = 50;
    public static readonly TILE_HEIGHT = 50;

    protected name: string;

    protected width: number;
    protected height: number;

    private blocks: Block[] = []

    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo);
        this.height = height;
        this.width = width;
        const entries: [string, any][] = Object.entries(config);
        this.initializePlatforms(entries);
    }

    private initializePlatforms(entries: [string, any][]) {
        const tileSprite = this.repo.getImage("tile");
        tileSprite.height = Level.TILE_HEIGHT;
        tileSprite.width = Level.TILE_WIDTH;

        this.name = String(entries.find((entry) => entry[0] === "name")[1]);
        let startPos = 0;
        this.blocks = Object.values(entries.find(entry => entry[0] === "platforms")[1]).map((settings: { xStart: number; xEnd: number; yStart: number; yEnd: number; }, i: number) => {
            const amountOfTiles = Math.floor(settings.xEnd / tileSprite.width);
            if (startPos <= settings.xStart) {
                startPos = settings.xStart
            }
            return new Block(startPos, 0, 0);
            startPos += tileSprite.width;
        });
    }
}