abstract class Logic {

    protected _frames: number = 0;

    public constructor() {

    }

    public set frames(frame: number) {
        this._frames = frame;
    }



    public animate(ms: number): boolean {
        const timePerFrameSec = 1000 / (window as any).fps;
        const statement = this._frames % (ms / timePerFrameSec) === 0;
        return statement
    }
}