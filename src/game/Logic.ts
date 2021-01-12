abstract class Logic {

    private _frames: number = 0;
    private _repo: ImageLoader;
    private _width: number;
    private _height: number;

    /**
     * Constructs the logic object
     * @param {ImageLoader} repo 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(repo: ImageLoader, width: number, height: number) {
        this._repo = repo;
        this._width = width;
        this._height = height;
    }

    /**
     * gets the canvas height
     */
    public get height(): number {
        return this._height
    }

    /**
     * gets the canvas width
     */
    public get width(): number {
        return this._width
    }

    /**
     * gets the image repository
     */
    public get repo() {
        return this._repo;
    }

    /** 
     * sets the amount of frames
     */
    public set frames(frame: number) {
        this._frames = frame;
    }

    /**
     * gets the amount of passed frames
     */
    public get frames(): number {
        return this._frames;
    }

    /**
     * divides 1000ms by the fps of the client which when divided by the given ms you get the amount of frames that happen in that time
     * for example you have a 60hz monitor = 60-62fps and the ms input is 250ms which is a quarter of a second you will get a quarter of 60 frames which is 15 frames
     * @param {number} ms 
     */
    public animate(ms: number): boolean {
        const timePerFrameSec = 1000 / window.fps;
        const amountOfFrames = Math.round(ms / timePerFrameSec)
        const statement = this._frames % amountOfFrames === 0;
        return statement
    }


}