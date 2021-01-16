class Calculate {
    public static readonly BASELINE_WIDTH = 1920;
    public static readonly BASELINE_HEIGHT = 969;


    public static calculateWidthMultiplier(width: number): number {
        return width * (1 + (window.innerWidth - Calculate.BASELINE_WIDTH) / Calculate.BASELINE_WIDTH);
    }

    public static calculateHeightMultiplier(height: number): number {
        return height * (1 + (window.innerHeight - Calculate.BASELINE_HEIGHT) / Calculate.BASELINE_HEIGHT);
    }

    public static calculateY(y: number): number {
        // gets percentage
        const percentage: number = y / Calculate.BASELINE_HEIGHT * 100
        // creates new percentage
        const newYPos: number = window.innerHeight / 100 * percentage;
        return Math.round(newYPos);
    }

    public static calculateX(x: number): number {
        // gets percentage
        const percentage: number = x / Calculate.BASELINE_WIDTH * 100
        // creates new percentage
        const newXPos: number = window.innerWidth / 100 * percentage;
        return Math.round(newXPos);
    }

    public static calculate(number: number): number {
        const actual = (window.innerWidth * window.innerHeight);
        const baseLine = (Calculate.BASELINE_WIDTH * Calculate.BASELINE_HEIGHT);
        const difference = (actual - baseLine)
        const multiplier = 1 + (difference / baseLine)
        return number * multiplier;
    }
}