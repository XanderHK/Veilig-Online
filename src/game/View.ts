/// <reference path="Level.ts"/>
class View extends Level {

    private ctx: CanvasRenderingContext2D;

    
    protected currentPlayerImgIndex: { state: number } = { state: 0 };
    
    
    public constructor(config: Config, ctx: CanvasRenderingContext2D, repo: ImageLoader, width: number, height: number) {
        super(config, repo, width, height);
        this.ctx = ctx;

        
        
        
    }

    public drawLevel() {
        new TextString(this.width / 2, this.height / 2, this.name).drawText(this.ctx);
        this.movePlayer();
        this.drawPlayer();
        this.player.gravity();
    }
     /**
     * Checks if the remainder of the amount of frames is 0 
     * @param {number} amountOfFrames 
     */
    protected nextAnimation(amountOfFrames: number): boolean {
        const statement = this._frames % amountOfFrames === 0;
        return statement
    }

    
    
    private drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        this.player.yPos = 200
        this.player.draw(this.ctx, next)
    }
    
    

     

      
    }
