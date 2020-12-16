/// <reference path="Game.ts"/>
class Menu {

    public static readonly MENU_BACKGROUND = Game.IMG_PATH + "earth.png.png";
    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
    public static readonly AMOUNT_OF_FRAMES = 37;

    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private backgroundAudio: HTMLAudioElement;
    private audio: boolean = true;
    private backgroundFrame: { index: number, frame: HTMLImageElement };
    private currentPlayerImgIndex: { state: number, frame: number } = { state: 0, frame: 0 };
    private keyboardListener: KeyboardListener;
    private player: Player;
    private allImages: { name: string, images: HTMLImageElement[] }[] = []
    private canJump: boolean = true;

    /**
     * 
     * @param ctx 
     */
    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        this.player = new Player(0, 0, 0);
        const levelObjHeight = this.findImage("levels")[0];
        const xpos = (this.width / 2 - 425) + (levelObjHeight.width / 2);
        this.player.xPos = xpos;
    }

    private initializeImages() {
        const earth: HTMLImageElement = new CreateImage(Menu.MENU_BACKGROUND).createImage(300, 300);
        const activeSpeaker: HTMLImageElement = new CreateImage(Game.IMG_PATH + "not-muted.png").createImage(50, 50);
        const inactiveSpeaker: HTMLImageElement = new CreateImage(Game.IMG_PATH + "muted.png").createImage(50, 50);
        const playerImages: HTMLImageElement[] = Array(2).fill(null).map((e, i) => {
            return new CreateImage(Game.IMG_PATH + "player/main_char_" + Number(i + 1) + ".png").createImage();
        });
        const backgroundFrames: HTMLImageElement[] = Array(Menu.AMOUNT_OF_FRAMES).fill(null).map((e, i) => {
            return new CreateImage(Game.IMG_PATH + `background/${i}.jpg`).createImage(this.width, this.height);
        });
        const levels: HTMLImageElement[] = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            // Images start with 1 index at 0 
            return new CreateImage(Game.IMG_PATH + `level${i + 1}.png`).createImage();
        });

        const allInitImages = { background: earth, activeSpeaker: activeSpeaker, inactiveSpeaker: inactiveSpeaker, playerImages: playerImages, backgroundFrames: backgroundFrames, levels: levels };
        Object.entries(allInitImages).forEach((e) => {
            let images = e[1];
            if (!Array.isArray(e[1])) {
                images = [e[1]];
            }
            this.allImages.push({ name: e[0], images: images as HTMLImageElement[] });
        });
        const initialFrame = this.findImage("backgroundFrames")[0];
        this.backgroundFrame = { index: 0, frame: initialFrame };
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
        this.movePlayer();
        this.drawPlayer();
        /**
         * TODO delegate all click events to the clickhandler
         */
        window.addEventListener("click", event => {
            const referenceImg = this.findImage("activeSpeaker")[0];
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

    private findImage(name: string) {
        return this.allImages.find((e) => e.name === name).images
    }

    private drawPlayer() {
        if (this.currentPlayerImgIndex.frame % 15 === 0) {
            if (this.currentPlayerImgIndex.state !== 0) {
                this.currentPlayerImgIndex.state = 0;
            } else {
                this.currentPlayerImgIndex.state = 1;
            }
        }
        const next = this.currentPlayerImgIndex.state;
        const levelObjHeight = this.findImage("levels")[0];
        const playerPos = this.height / 10 * 1.5 + levelObjHeight.height;
        this.player.yPos = playerPos - this.player.getSprite(next).height
        this.player.draw(this.ctx, next)
        this.currentPlayerImgIndex.frame++;
    }

    private movePlayer() {
        const levels = this.findImage("levels")
        // const lastLevel = levels[levels.length - 1].width;
        const maxBound = this.width / 2 - 425 + 600;
        const minBound = this.width / 2 - 425;
        console.log(this.player.xPos)
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJump && this.player.xPos <= maxBound) {
            this.canJump = false;
            this.player.xPos = this.player.xPos + 300;

        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJump && this.player.xPos >= minBound) {
            this.canJump = false;
            this.player.xPos = this.player.xPos - 300

        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJump) {
            this.canJump = true;
        }
    }

    /**
     * 
     */
    private drawMenuItems() {
        this.findImage("levels").reduce((result, current) => {
            this.ctx.drawImage(current, result, this.height / 10 * 2.5)
            console.log(current.width);
            result += current.width;
            return result;
        }, this.width / 2 - 425);
    }

    private drawSpeaker() {
        let speaker: HTMLImageElement = this.findImage("activeSpeaker")[0];
        if (!this.audio) speaker = this.findImage("inactiveSpeaker")[0];
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height)
    }

    /**
     * 
     */
    private drawBackGround() {
        if (this.backgroundFrame.index % 3 === 0) {
            const current = this.findImage("backgroundFrames").indexOf(this.backgroundFrame.frame);
            let next = current + 1;
            if (next === Menu.AMOUNT_OF_FRAMES - 1) {
                next = 0;
            }
            this.backgroundFrame.frame = this.findImage("backgroundFrames")[next]
        }
        const background = this.findImage("background")[0];
        this.ctx.drawImage(this.backgroundFrame.frame, 0, 0, this.width, this.height)
        this.ctx.drawImage(background, (this.width / 2) - (background.width / 2), (this.height / 2) - (background.height / 2), background.width, background.height);
        this.backgroundFrame.index++;
    }
}