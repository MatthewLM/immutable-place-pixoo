import CanvasExaminer from "./CanvasExaminer";

interface Coord {
    x: number,
    y: number
}

/**
 * Rotates through interesting parts of the canvas according to entropy.
 */
export default class CanvasSelector {
    #examiner: CanvasExaminer;

    #lastSegments: Array<Coord> = [];

    constructor(examiner: CanvasExaminer) {
        this.#examiner = examiner;
    }

    /**
     * Returns a 64x64 segment of the canvas that is interesting. It rotates
     * between [n] segments assuming nothing changes.
     */
    select(n: number): CanvasExaminer {

        // Obtain scores
        const scores = this.#examiner.calcScores();

        let maxCoord = {
            x: 0,
            y: 0
        };
        let maxScore = 0;

        // Find maximum score for segment that doesn't overlap with the last segments.
        for (let y = 0; y < this.#examiner.width-63; y++) {
            for (let x = 0; x < this.#examiner.width-63; x++) {

                // Only use if outside of previous segments
                const outside = this.#lastSegments.every(
                    lastCoord => x + 64 < lastCoord.x || x > lastCoord.x + 64
                        || y + 64 < lastCoord.y || y > lastCoord.y + 64
                );

                // If score is higher, select
                if (outside && scores[y][x] > maxScore) {
                    maxScore = scores[y][x];
                    maxCoord = { x, y };
                }

            }
        }

        // Add to last segments after trimming array so there is n-1 segment
        // locations to compare against.
        this.#lastSegments = [maxCoord, ...this.#lastSegments.slice(0, n-2)];

        return this.#examiner.crop({
            x: maxCoord.x,
            y: maxCoord.y,
            w: 64,
            h: 64
        });


    }

}

