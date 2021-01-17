class Calculate {
    public static readonly NATIVE_WIDTH = 1920;
    public static readonly NATIVE_HEIGHT = 969;

    /**
     * Gets the difference in percentages between the native which then gets multiplied by the width parameter which returns a bigger or smaller value depending on screen res
     * @param {number} width 
     */
    public static calculateWidthMultiplier(width: number): number {
        return width * (1 + (window.innerWidth - Calculate.NATIVE_WIDTH) / Calculate.NATIVE_WIDTH);
    }

    /**
     * Gets the difference in percentages between the native which then gets multiplied by the height parameter which returns a bigger or smaller value depending on screen res
     * @param {number} height 
     */
    public static calculateHeightMultiplier(height: number): number {
        return height * (1 + (window.innerHeight - Calculate.NATIVE_HEIGHT) / Calculate.NATIVE_HEIGHT);
    }

    /**
     * 
     * @param {number} y 
     */
    public static calculateY(y: number): number {
        // gets percentage
        const percentage: number = y / Calculate.NATIVE_HEIGHT * 100
        // creates new percentage
        const newYPos: number = window.innerHeight / 100 * percentage;
        return Math.round(newYPos);
    }

    /**
     * 
     * @param {number} x 
     */
    public static calculateX(x: number): number {
        // gets percentage
        const percentage: number = x / Calculate.NATIVE_WIDTH * 100
        // creates new percentage
        const newXPos: number = window.innerWidth / 100 * percentage;
        return Math.round(newXPos);
    }

    /**
     * 
     * @param {number} number 
     */
    public static calculate(number: number): number {
        const actual = (window.innerWidth * window.innerHeight);
        const NATIVE = (Calculate.NATIVE_WIDTH * Calculate.NATIVE_HEIGHT);
        const difference = (actual - NATIVE)
        const multiplier = 1 + (difference / NATIVE)
        return number * multiplier;
    }
}