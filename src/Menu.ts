class Menu {

    public static readonly MENU_BACKGROUND = Game.IMG_PATH + "yehesss.jpg";
    private ctx: CanvasRenderingContext2D;
    private background: HTMLImageElement;

    public constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.background = new CreateImage(Menu.MENU_BACKGROUND).createImage();
    }


    public drawMenu() {
        this.drawBackGround();
    }

    private drawMenuItems() {

    }

    private drawBackGround() {
        console.log(this.background);
        this.ctx.drawImage(this.background, 0, 0, window.innerWidth, window.innerHeight);
    }
}