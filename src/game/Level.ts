/// <reference path="Logic.ts"/>
abstract class Level extends Logic {

    protected name: string;

    protected width: number;
    protected height: number;

    private blocks: Block[] = []

    public constructor(config: Config, repo: ImageLoader, width: number, height: number) {
        super(repo);
        this.height = height;
        this.width = width;

        const entries = Object.entries(config);
        this.name = String(entries.find((entry) => entry[0] === "name")[1])
        const platforms = Object.values(entries.find(entry => entry[0] === "platforms")[1]).map((settings: { xStart: number, xEnd: number, yStart: number, yEnd: number }) => {
            console.log(settings.xEnd);
        });
        console.log(platforms);
    }
}