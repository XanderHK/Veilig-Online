/// <reference path="Game.ts"/>
class Menu {

    public static readonly MENU_BACKGROUND = Game.IMG_PATH + "yehesss.jpg";
    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";

    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private background: HTMLImageElement;
    private backgroundAudio: HTMLAudioElement;
    private activeSpeaker: HTMLImageElement;
    private inacitveSpeaker: HTMLImageElement;
    private audio: boolean = true;

    /**
     * 
     * @param ctx 
     */
    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.background = new CreateImage(Menu.MENU_BACKGROUND).createImage();
        this.activeSpeaker = new CreateImage(Game.IMG_PATH + "not-muted.png").createImage(50, 50)
        this.inacitveSpeaker = new CreateImage(Game.IMG_PATH + "muted.png").createImage(50, 50)
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
    }

    /**
     * 
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
     * 
     */
    public drawMenu() {
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        /**
         * TODO delegate all click events to the clickhandler
         */
        window.addEventListener("click", event => {
            if (
                event.clientX >= 0 &&
                event.clientX < 0 + this.activeSpeaker.width &&
                event.clientY >= 0 &&
                event.clientY <= 0 + this.activeSpeaker.height
            ) {
                this.audio = (this.audio === true ? false : true);

            }
        });
    }

    // TODO: @ronnie position the menu items
    // 3 Platforms
    /**
     * 
     */
    private drawMenuItems() {
        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((result, current, index) => {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(result, this.height / 4, 100, 25);
            const text = new TextString(result, this.height / 4, `Level ${index + 1}`);
            text.fillStyle = "white";
            text.fontSize = 14;
            text.drawText(this.ctx);
            result += 150;
            return result;
        }, this.width / 2 - 175);
    }

    private drawSpeaker() {
        let speaker: HTMLImageElement = this.activeSpeaker;
        if (!this.audio) speaker = this.inacitveSpeaker;
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height)
    }

    /**
     * 
     */
    private drawBackGround() {
        this.ctx.drawImage(this.background, 0, 0, window.innerWidth, window.innerHeight);
    }
}