/// <reference path="Game.ts"/>
class MenuOld {
    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
    public static readonly AMOUNT_OF_FRAMES = 37;

    private ctx: CanvasRenderingContext2D;
    private keyboardListener: KeyboardListener;
    private player: Player;
    private menuItems: MenuItem[] = [];
    private speakers: Speaker[] = [];
    private repo: ImageLoader;

    private backgroundFrame: { frame: HTMLImageElement, key: string };
    private backgroundAudio: HTMLAudioElement;
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private canJump: { right: boolean, left: boolean } = { right: true, left: true }

    private width: number;
    private height: number;
    private audio: boolean = true;
    private frames: number = 0;

    /**
     * Constructs the menu
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number, repo: ImageLoader) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(MenuOld.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.repo = repo;

        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        const playerSprites: HTMLImageElement[] = Player.PLAYER_SPRITES.map((key: string) => this.repo.getImage(key))
        this.player = new Player(this.width / 3, 0, 0, playerSprites);
    }



    /**
     * Method for creating all the sprites that will be used by this class
     */
    private initializeImages() {
        this.speakers = [...Speaker.SPEAKER_SPRITES].map((key: string) => {
            const image = this.repo.getImage(key);
            return new Speaker(0, 0, 0, image)
        });

        this.menuItems = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            const image = this.repo.getImage(`level${i + 1}`);
            const x = this.width / 3 + (image.width * 2) * i
            const instance = new MenuItem(x, this.height / 10 * 2.5, image);
            return instance;
        });

        this.backgroundFrame = { frame: this.repo.getImage("0"), key: "0" };
    }

    /**
     * Checks if the audio flag is true or false and turns the audio on or of depending on this
     */
    private backGroundAudio() {
        if (this.audio) {
            this.backgroundAudio.play();
        } else {
            this.backgroundAudio.pause();
            this.backgroundAudio.currentTime = 0;
        }
    }

    /**
     * Checks if the remainder of the amount of frames is 0 
     * @param {number} amountOfFrames 
     */
    private nextAnimation(amountOfFrames: number): boolean {
        const statement = this.frames % amountOfFrames === 0;
        return statement
    }


    // /**
    //  * Checks if the remainder of the amount of frames is 0 
    //  * @param {number} amountOfFrames 
    //  */
    // private nextAnimation(seconds: number): boolean {
    //     const timePerFrameSec = 1 / (window as any).fps;
    //     const statement = this.frames % (seconds / timePerFrameSec) === 0;
    //     return statement
    // }

    /**
     * Method for drawing the player
     */
    private drawPlayer() {
        if (this.nextAnimation(15)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        const levelObjHeight = this.repo.getImage("level1").height;
        const playerPos = this.height / 10 * 2.3 + levelObjHeight;
        this.player.yPos = playerPos - this.repo.getImage(`main_char_${next + 1}`).height
        this.player.draw(this.ctx, next)
    }

    /**
     * Method for moving the player on the screen
     */
    private movePlayer() {
        const maxBound = this.menuItems[this.menuItems.length - 1].xPos;
        const minBound = this.menuItems[0].xPos;
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJump.right && this.player.xPos <= maxBound) {
            this.canJump.right = false;
            const nextXPos = this.player.xPos + (this.repo.getImage("level1").width * 2);
            if (nextXPos <= maxBound) {
                this.player.xPos = nextXPos;
            }
        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJump.left && this.player.xPos >= minBound) {
            this.canJump.left = false;
            const nextXPos = this.player.xPos - this.repo.getImage("level1").width * 2;
            if (nextXPos >= minBound) {
                this.player.xPos = nextXPos;
            }
        }

        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !this.canJump.left) {
            this.canJump.left = true;
        }

        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJump.right) {
            this.canJump.right = true;
        }
    }

    /**
     * Method for drawing the menu items
     */
    private drawMenuItems() {
        this.menuItems.forEach(menuItem => {
            menuItem.draw(this.ctx);
        })
    }

    /**
     * Method for drawing the speaker
     */
    private drawSpeaker() {
        const speakerSpriteIndex: number = this.audio ? 0 : 1;
        this.speakers[speakerSpriteIndex].draw(this.ctx);
    }

    /**
     * Method for drawing the background
     */
    private drawBackGround() {
        if (this.nextAnimation(3)) {
            this.backgroundFrame.key = String(Number(this.backgroundFrame.key) + 1);
            if (Number(this.backgroundFrame.key) >= MenuOld.AMOUNT_OF_FRAMES) {
                this.backgroundFrame.key = String(0);
            }
            this.backgroundFrame.frame = this.repo.getImage(this.backgroundFrame.key);
        }
        const background = this.repo.getImage("earth");
        background.width = 300;
        background.height = 300;
        this.ctx.drawImage(this.backgroundFrame.frame, 0, 0, this.width, this.height)
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
    }

    /**
   * W.I.P Method that checks what level the player is on
   */
    public interactsWithLevel() {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            this.menuItems.forEach((menuItem) => {
                const currentPlayerSprite = this.repo.getImage(`main_char_${this.currentPlayerImgIndex.state + 1}`);
                const playerPos = this.player.xPos + currentPlayerSprite.width
                if (playerPos >= menuItem.xPos && playerPos <= menuItem.xPos + this.repo.getImage("level1").width) {
                    // Do do something
                    console.log("pressed")
                }
            })
        }
    }

    /**
     * Mute method
     */
    private mute() {
        /**
           * TODO delegate all click events to the clickhandler
           */
        window.addEventListener("click", event => {
            const referenceImg: HTMLImageElement = this.repo.getImage("muted")
            if (
                event.clientX >= 0 &&
                event.clientX < 0 + referenceImg.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + referenceImg.height
            ) {
                this.audio = (this.audio === true ? false : true);
            }
        });
    }


    /**
     * Draws the menu entirely 
     */
    public drawMenu() {
        this.mute();
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        this.interactsWithLevel()
        this.frames++;
    }
}