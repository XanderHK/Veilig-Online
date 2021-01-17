interface Config {
    name: string,
    platforms: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    spikes: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    questions: { answer: boolean, question: string }[]
    background: string,
    tile: string,
    water: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    enemyPos: { x: number, y: number }[],
    infoPos: { x: number, y: number }[]
}