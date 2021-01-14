class Calculate {
    public static readonly BASELINE_WIDTH = 1920;
    public static readonly BASELINE_HEIGHT = 969;


    public static calculateWidthMultiplier(): number {
        return (1 - Math.abs((window.innerWidth - Calculate.BASELINE_WIDTH) / Calculate.BASELINE_WIDTH));
    }

    public static calculateHeightMultiplier(): number {
        return (1 - Math.abs((window.innerHeight - Calculate.BASELINE_HEIGHT) / Calculate.BASELINE_HEIGHT));
    }
}