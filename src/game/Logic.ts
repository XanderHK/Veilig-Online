abstract class Logic {

    protected _frames: number = 0;
    protected repo: ImageLoader;
  
    public constructor(repo: ImageLoader) {
        this.repo = repo;
    }

    public set frames(frame: number) {
        this._frames = frame;
    }

    public animate(ms: number): boolean {
        const timePerFrameSec = 1000 / window.fps;
        const statement = this._frames % (ms / timePerFrameSec) === 0;
        return statement
    }
    
    
}