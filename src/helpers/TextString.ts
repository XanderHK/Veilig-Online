/**
 * Responsible for drawing a piece of text to the canvas. It utilyzes the 
 * `CanvasRenderingContext2D.fillText()` method of the Canvas 2D API to add
 * a text string to the canvas.
 * 
 * @see [CanvasRenderingContext2D.fillText()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText)
 * 
 * @author BugSlayer
 */
class TextString {

    /**
     * The x-axis coordinate of the point at which to begin drawing the text, 
     * in pixels.
     * 
     * NOTE: the way the text is drawn horizontally from the starting point is 
     * pending on the text alignment setting. If this is set to `"center"`, the 
     * staring point will be the center of the text.
     */
    public x: number;

    /**
     * The y-axis coordinate of the point at which to begin drawing the text, 
     * in pixels.
     * 
     * NOTE: the way the text is drawn vertically from the starting point is 
     * pending on the text basline setting. If this is set to `"middle"`, the 
     * staring point will be the center of the text.
     */
    public y: number;

    /**
     * The text that this TextItem will draw
     */
    public text: string;

    /**
     * The font of this text
     */
    public font: string = "Edmunds";

    /**
     * The font size in pixels of this text
     */
    public fontSize: number = 30;

    /**
     * The fillStyle of this text. Can be set to a color or some other style.
     * 
     * @see [CanvasRenderingContext2D.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)
     */
    public fillStyle: string | CanvasGradient | CanvasPattern = "black";

    /**
     * The text alignment of this text
     * 
     * @see [CanvasRenderingContext2D.textAlign](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign)
     */
    public textAlign: CanvasTextAlign = "center";


    /**
     * The current text baseline used when drawing text, which is basically the
     * vertical alignment of the text. Default is set to `"alphabetic"`. 
     * 
     * @see [CanvasRenderingContext2D.textBaseline](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline)
     */
    public textBaseline: CanvasTextBaseline = "alphabetic";


    /**
     * Constructs a new TextItem.
     * 
     * @param {number} x - Horizontal coordinate in pixels
     * @param {number} y - Vertical coordinate in pixels
     * @param {string} text - Text to write
     */
    public constructor(x: number, y: number, text: string) {
        this.x = x;
        this.y = y;
        this.text = text;
    }


    /**
     * Draws the current text with the current settings to the specified
     * CanvasRenderingContext2D.
     * 
     * @param {CanvasRenderingContext2D} ctx - The renderingcontext to draw on 
     */
    public drawText(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.fillStyle;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

}