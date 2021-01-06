abstract class Logic {

    private _frames: number = 0;
    private _repo: ImageLoader;

    public constructor(repo: ImageLoader) {
        this._repo = repo;
    }

    /**
     * 
     */
    public get repo() {
        return this._repo;
    }

    /** 
     * 
     */
    public set frames(frame: number) {
        this._frames = frame;
    }

    /**
     * 
     */
    public get frames(): number {
        return this._frames;
    }

    /**
     * 
     * @param ms 
     */
    public animate(ms: number): boolean {
        const timePerFrameSec = 1000 / window.fps;
        const amountOfFrames = Math.floor(ms / timePerFrameSec)
        const statement = this._frames % amountOfFrames === 0;
        return statement
    }


}