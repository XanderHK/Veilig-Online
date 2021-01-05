interface Config {
    name: string,
    platforms: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    spikes: { xStart: number, xEnd: number, yStart: number, yEnd: number }[]
}