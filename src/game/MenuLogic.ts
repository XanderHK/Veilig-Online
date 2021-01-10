/// <reference path="Logic.ts"/>
abstract class MenuLogic extends Logic {

    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
    public static readonly AMOUNT_OF_FRAMES = 37;

    private keyboardListener: KeyboardListener;
    private backgroundAudio: HTMLAudioElement;
    private canJump: { right: boolean, left: boolean } = { right: true, left: true }
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private backgroundFrame: { frame: HTMLImageElement, key: string };

    protected player: Player;
    protected menuItems: MenuItem[] = [];
    protected speakers: Speaker[] = [];

    protected audio: boolean = true;
    protected _totalScore: number = 0;


    /**
     * Constructs the menu
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    public constructor(width: number, height: number, repo: ImageLoader) {
        super(repo, width, height);
        this.backgroundAudio = new Audio(MenuLogic.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.backgroundFrame = { frame: this.repo.getImage("0"), key: "0" };

        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        const playerSprites: HTMLImageElement[] = Player.PLAYER_SPRITES.map((key: string) => this.repo.getImage(key))
        this.player = new Player(this.width / 3, 0, 0, 0, playerSprites);
    }


    public set totalScore(score: number) {
        this._totalScore = score;
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
   * Method that checks if a the player object is standing on a menu item and returns the menu item
   */
    public interactsWithLevel() {
        let returnValue: any[] = [false, null];
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_ENTER)) {
            this.menuItems.forEach((menuItem, i) => {
                const currentPlayerSprite = this.repo.getImage(`main_char_${this.currentPlayerImgIndex.state + 1}`);
                const playerPos = this.player.xPos + currentPlayerSprite.width
                if (playerPos >= menuItem.xPos && playerPos <= menuItem.xPos + this.repo.getImage("level1").width) {
                    returnValue = [true, i];
                }
            })
        }
        return returnValue;
    }

    /**
     * changes the state of the player sprite every 250ms from 0-1 which creates the idle animation on the menu for the player
     */
    protected changeSprite() {
        if (this.animate(250)) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        return next;
    }

    /**
     * Changes the background picture every 50ms creating the moving effect
     */
    protected changeBackground() {
        if (this.animate(50)) {
            this.backgroundFrame.key = String(Number(this.backgroundFrame.key) + 1);
            if (Number(this.backgroundFrame.key) >= MenuLogic.AMOUNT_OF_FRAMES) {
                this.backgroundFrame.key = String(0);
            }
            this.backgroundFrame.frame = this.repo.getImage(this.backgroundFrame.key);
        }
        return this.backgroundFrame.frame
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