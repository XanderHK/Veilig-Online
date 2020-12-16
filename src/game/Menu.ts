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
    private backgroundFrame: { frame: HTMLImageElement };
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private keyboardListener: KeyboardListener;
    private player: Player;
    private allImages: { name: string, images: HTMLImageElement[] }[] = []
    private canJump: boolean = true;
    private frames: number = 0;
    private menuItems: MenuItem[] = [];

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
        this.player = new Player(this.width / 2 - 425, 0, 0);
    }

    private initializeImages() {
        const earth: HTMLImageElement = CreateImage.createImage(Menu.MENU_BACKGROUND, 300, 300);
        const activeSpeaker: HTMLImageElement = CreateImage.createImage(Game.IMG_PATH + "not-muted.png", 50, 50);
        const inactiveSpeaker: HTMLImageElement = CreateImage.createImage(Game.IMG_PATH + "muted.png", 50, 50);
        const backgroundFrames: HTMLImageElement[] = Array(Menu.AMOUNT_OF_FRAMES).fill(null).map((e, i) => {
            return CreateImage.createImage(Game.IMG_PATH + `background/${i}.jpg`);
        });

        Array(Game.AMOUNT_OF_LEVELS).fill(null).reduce((result, menuItem, i) => {
            const instance = new MenuItem(result, this.height / 10 * 2.5, i);
            this.menuItems.push(instance);
            result += instance.getSprites(0).width;
            console.log(result);
            return result;
        }, this.width / 2 - 425);

        const allInitImages = { background: earth, activeSpeaker: activeSpeaker, inactiveSpeaker: inactiveSpeaker, backgroundFrames: backgroundFrames };
        Object.entries(allInitImages).forEach((e) => {
            let images = e[1];
            if (!Array.isArray(e[1])) {
                images = [e[1]];
            }
            this.allImages.push({ name: e[0], images: images as HTMLImageElement[] });
        });

        // const fr = new FileReader();
        // fr.
        const initialFrame = this.findImage("backgroundFrames")[0];
        this.backgroundFrame = { frame: initialFrame };
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
        this.frames++;
    }

    private findImage(name: string) {
        return this.allImages.find((e) => e.name === name).images
    }

    public nextAnimation(amountOfFrames: number): boolean {
        const statement = this.frames % amountOfFrames === 0;
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
        const levelObjHeight = this.menuItems[0].getSprites(0).height;
        const playerPos = this.height / 10 * 3 + levelObjHeight;
        this.player.yPos = playerPos - this.player.getSprites(next).height
        this.player.draw(this.ctx, next)
    }

    private movePlayer() {
        const maxBound = this.width / 2 - 425 + 600;
        const minBound = this.width / 2 - 425 + 300;
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJump && this.player.xPos <= maxBound) {
            this.canJump = false;
            if (this.player.xPos + 300 <= maxBound) this.player.xPos = this.player.xPos + 300;
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJump && this.player.xPos >= minBound) {
            this.canJump = false;
            if (this.player.xPos + 300 >= minBound) this.player.xPos = this.player.xPos - 300

        }
        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJump) {
            this.canJump = true;
        }
    }

    /**
     * 
     */
    private drawMenuItems() {
        console.log(this.menuItems.length)
        this.menuItems.forEach(menuItem => {
            menuItem.draw(this.ctx);
        })
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
        if (this.nextAnimation(3)) {
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
    }
}