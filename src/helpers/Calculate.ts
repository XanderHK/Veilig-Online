class Calculate {
    public static readonly BASELINE_WIDTH = 1920;
    public static readonly BASELINE_HEIGHT = 969;


    public static calculateWidthMultiplier(): number {
        return (1 - Math.abs((window.innerWidth - Calculate.BASELINE_WIDTH) / Calculate.BASELINE_WIDTH));
    }

    public static calculateHeightMultiplier(): number {
        return (1 - Math.abs((window.innerHeight - Calculate.BASELINE_HEIGHT) / Calculate.BASELINE_HEIGHT));
    }

    public static calculateY(y: number): number {
        // gets percentage
        const percentage: number = y / Calculate.BASELINE_HEIGHT * 100
        // creates new percentage
        const newYPos: number = window.innerHeight / 100 * percentage;
        return newYPos;
    }

    public static calculateX(x: number): number {
        // gets percentage
        const percentage: number = x / Calculate.BASELINE_WIDTH * 100
        // creates new percentage
        const newXPos: number = window.innerWidth / 100 * percentage;
        return newXPos;
    }
}