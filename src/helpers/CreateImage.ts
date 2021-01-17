class CreateImage {

    public imgSrc: string;

    /**
     * Assigns values to the attributes on initialisation of the class
     * @param {string} imgSrc 
     */
    public constructor(imgSrc: string) {
        this.imgSrc = imgSrc;
    }

    /**
    * Creates a HTML image element
    */
    public createImage(height?: number, width?: number): HTMLImageElement {
        const image: HTMLImageElement = document.createElement("img");
        image.src = this.imgSrc;
        if (height > 0) {
            image.height = height;
        }
        if (width > 0) {
            image.width = width;
        }
        return image;
    }
}