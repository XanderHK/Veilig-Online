/// <reference path="Logic.ts"/>
abstract class MenuLogic extends Logic {

    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
    public static readonly AMOUNT_OF_FRAMES = 37;

    private keyboardListener: KeyboardListener;
    private backgroundAudio: HTMLAudioElement;
    private canJump: { right: boolean, left: boolean } = { right: true, left: true }

    protected player: Player;
    protected menuItems: MenuItem[] = [];
    protected speakers: Speaker[] = [];

    protected repo: ImageLoader;
    protected ctx: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;

    protected currentPlayerImgIndex: { state: number } = { state: 0 };
    protected audio: boolean = true;


    /**
     * Constructs the menu
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number, repo: ImageLoader) {
        super();
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(MenuLogic.MENU_MUSIC);
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


    }

    /**
     * Checks if the audio flag is true or false and turns the audio on or of depending on this
     */
    protected backGroundAudio() {
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
    protected nextAnimation(amountOfFrames: number): boolean {
        const statement = this._frames % amountOfFrames === 0;
        return statement
    }

    /**
     * Method for moving the player on the screen
     */
    protected movePlayer() {
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
   * W.I.P Method that checks what level the player is on
   */
    protected interactsWithLevel() {
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
    protected mute() {
        /**
           * TODO delegate all click events to the clickhandler
           */
        window.addEventListener("click", event => {
            const referenceImg = this.repo.getImage("muted")
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



}