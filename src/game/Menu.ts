/// <reference path="Game.ts"/>
class Menu {

    public static readonly MENU_BACKGROUND = Game.IMG_PATH + "earth.png.png";
    public static readonly MENU_MUSIC = Game.AUDIO_PATH + "theme_song_veilig_online_the_game.wav";
    public static readonly AMOUNT_OF_FRAMES = 37;

    private ctx: CanvasRenderingContext2D;
    private backgroundAudio: HTMLAudioElement;
    private backgroundFrame: { frame: HTMLImageElement };
    private allImages: { name: string, images: HTMLImageElement[] }[] = []
    private keyboardListener: KeyboardListener;
    private player: Player;
    private menuItems: MenuItem[] = [];
    private currentPlayerImgIndex: { state: number } = { state: 0 };
    private width: number;
    private height: number;
    private audio: boolean = true;
    private canJumpRight: boolean = true;
    private canJumpLeft: boolean = true;
    private frames: number = 0;

    /**
     * Constructs the menu
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.backgroundAudio = new Audio(Menu.MENU_MUSIC);
        this.backgroundAudio.loop = true;
        this.initializeImages();
        this.keyboardListener = new KeyboardListener();
        this.player = new Player(this.width / 3, 0, 0);
    }

    /**
     * Method for creating all the sprites that will be used by this class
     */
    private initializeImages() {
        /**
         * Todo add the load event to each iamge and update the x and y pos
         * Remove all these consts and the allImages property and delegate to their own class so we can track the x and y positions more easily
         * 
         * Todo bundle all objects together and make one method to draw all of them
         */
        const earth: HTMLImageElement = CreateImage.createImage(Menu.MENU_BACKGROUND, 300, 300);
        const activeSpeaker: HTMLImageElement = CreateImage.createImage(Game.IMG_PATH + "not-muted.png", 50, 50);
        const inactiveSpeaker: HTMLImageElement = CreateImage.createImage(Game.IMG_PATH + "muted.png", 50, 50);
        const backgroundFrames: HTMLImageElement[] = Array(Menu.AMOUNT_OF_FRAMES).fill(null).map((e, i) => {
            return CreateImage.createImage(Game.IMG_PATH + `background/${i}.jpg`);
        });

        const allInitImages = { background: earth, activeSpeaker: activeSpeaker, inactiveSpeaker: inactiveSpeaker, backgroundFrames: backgroundFrames };
        Object.entries(allInitImages).forEach((e) => {
            let images = e[1];
            if (!Array.isArray(e[1])) {
                images = [e[1]];
            }
            this.allImages.push({ name: e[0], images: images as HTMLImageElement[] });
        });

        this.menuItems = Array(Game.AMOUNT_OF_LEVELS).fill(null).map((e, i) => {
            const instance = new MenuItem(0, this.height / 10 * 2.5, i);
            // instance.xPos = this.width / 2 - 375 + (instance.width[0] * 2) * i
            const image = instance.getSprites(0);
            //Test
            image.addEventListener("load", () => {
                instance.xPos = this.width / 3 + (image.width * 2) * i;
            })
            return instance;
        });


        const initialFrame = this.findImage("backgroundFrames")[0];
        this.backgroundFrame = { frame: initialFrame };
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
     *  Method that returns a image 
     * @param {string} name 
     */
    private findImage(name: string) {
        return this.allImages.find((e) => e.name === name).images
    }

    /**
     * Checks if the remainder of the amount of frames is 0 
     * @param {number} amountOfFrames 
     */
    private nextAnimation(amountOfFrames: number): boolean {
        const statement = this.frames % amountOfFrames === 0;
        return statement
    }

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
        const levelObjHeight = this.menuItems[0].getSprites().height;
        const playerPos = this.height / 10 * 2.3 + levelObjHeight;
        this.player.yPos = playerPos - this.player.getSprites(next).height
        this.player.draw(this.ctx, next)
    }

    /**
     * Method for moving the player on the screen
     */
    private movePlayer() {
        const maxBound = this.menuItems[this.menuItems.length - 1].xPos;
        const minBound = this.menuItems[0].xPos;
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && this.canJumpRight && this.player.xPos <= maxBound) {
            this.canJumpRight = false;
            const nextXPos = this.player.xPos + (this.menuItems[0].getSprites(0).width * 2);
            if (nextXPos <= maxBound) {
                this.player.xPos = nextXPos;
            }
        }

        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && this.canJumpLeft && this.player.xPos >= minBound) {
            this.canJumpLeft = false;
            const nextXPos = this.player.xPos - this.menuItems[0].getSprites(0).width * 2;
            if (nextXPos >= minBound) {
                this.player.xPos = nextXPos;
            }
        }

        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT) && !this.canJumpLeft) {
            this.canJumpLeft = true;
        }

        if (!this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT) && !this.canJumpRight) {
            this.canJumpRight = true;
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
        let speaker: HTMLImageElement = this.findImage("activeSpeaker")[0];
        if (!this.audio) speaker = this.findImage("inactiveSpeaker")[0];
        this.ctx.drawImage(speaker, 0, 0, speaker.width, speaker.height)
    }

    /**
     * Method for drawing the background
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

    /**
   * W.I.P Method that checks what level the player is on
   */
    public interactsWithLevel() {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            this.menuItems.forEach((menuItem) => {
                const playerPos = this.player.xPos + this.player.getWidth()
                if (playerPos >= menuItem.xPos && playerPos <= menuItem.xPos + menuItem.getWidth()) {
                    console.log(menuItem.getSprites())
                }
            })
        }
    }


    /**
     * Draws the menu entirely 
     */
    public drawMenu() {
        this.drawBackGround();
        this.drawMenuItems();
        this.backGroundAudio();
        this.drawSpeaker();
        this.movePlayer();
        this.drawPlayer();
        this.interactsWithLevel()
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
}