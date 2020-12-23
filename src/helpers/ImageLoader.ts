class ImageLoader {

    private images: { key: string, image: HTMLImageElement }[] = [];
    private loadingAssets: string[] = []

    /**
     * 
     * @param {string[]} assets 
     * @param {string} prefix 
     */
    public constructor(assets: string[], prefix: string) {
        assets.forEach((name: string) => {
            const path = prefix + name;
            this.loadImage(path);
        })
    }

    /**
     * Creates a image add the key to a array and removes it once it is done loading
     * @param {string} path 
     */
    private loadImage(path: string) {
        const image = new Image();
        const key = path.split("/").pop().split(".").shift();
        image.addEventListener("load", () => {
            this.images.push({ key: key, image: image });
            this.loadingAssets.splice(this.loadingAssets.indexOf(key), 1)
        })
        this.loadingAssets.push(key)
        image.src = path;
    }

    /**
     * Checks if the amount of keys is bigger then zero, if it is bigger than 0 the images havent finished loading
     */
    public isLoading(): boolean {
        return this.loadingAssets.length > 0;
    }

    /**
     * Returns a image depending on what key is supplied
     * @param {string} key 
     */
    public getImage(key: string): HTMLImageElement | null {
        const image = this.images.find((e) => e.key === key.split(".").shift())
        return image !== undefined ? image.image : null;
    }
}