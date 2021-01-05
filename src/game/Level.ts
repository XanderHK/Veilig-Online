/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    protected name: string;

    protected width: number;
    protected height: number;

    protected blocks: Block[] = []
    protected spikes: Spike[] = [];

    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo);
        this.height = height;
        this.width = width;
        const entries: [string, any][] = Object.entries(config);
        this.initializePlatforms(entries);
        this.initializeSpikes(entries);
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
}