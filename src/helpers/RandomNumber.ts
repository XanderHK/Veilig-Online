class RandomNumber {

    /**
    * Returns a random number between min and max
    * @param {number} min - lower boundary
    * @param {number} max - upper boundary
    */
    public static randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}