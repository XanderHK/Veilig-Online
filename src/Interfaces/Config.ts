interface Config {
    name: string,
    platforms: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    spikes: { xStart: number, xEnd: number, yStart: number, yEnd: number }[],
    questions: { answer: string, question: string }[]
    water: { xStart: number, xEnd: number, yStart: number, yEnd: number }[]
}