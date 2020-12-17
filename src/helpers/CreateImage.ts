class CreateImage {

    /**
    * Creates a HTML image element
    */
    public static createImage(src: string, width?: number, height?: number): HTMLImageElement {
        const image: HTMLImageElement = document.createElement("img");
        image.src = src;
        if (height !== undefined) {
            image.height = height;
        }
        if (width !== undefined) {
            image.width = width;
        }
        return image;
    }
}
//uwu