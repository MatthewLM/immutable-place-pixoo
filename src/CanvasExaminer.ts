import {Canvas, Colour, PixelColour} from "coin-canvas-lib";
import {createEntropyScorerKernel, createUpdateScorerKernel, GPUMode} from "./gpuScorer";

export default class CanvasExaminer {
    width: number;
    height: number;

    #mode: GPUMode;
    #skipPixels: number;

    #pixels: Colour[];
    // 24h EMA of updates for each pixel
    #lastUpdate = Date.now();
    #avUpdates: number[];

    #entropyKernel: ReturnType<typeof createEntropyScorerKernel>;
    #updateKernel: ReturnType<typeof createUpdateScorerKernel>;

    private constructor({
        pixels, w, h, mode, skipPixels
    } : {
        pixels: Colour[], w: number, h: number,
        mode: GPUMode, skipPixels: number
    }) {

        this.#pixels = pixels;
        this.#avUpdates = Array<number>(pixels.length).fill(0);

        this.width = w;
        this.height = h;

        this.#mode = mode;
        this.#skipPixels = skipPixels;
        this.#entropyKernel = createEntropyScorerKernel({
            w, h, s: skipPixels, mode
        });
        this.#updateKernel = createUpdateScorerKernel({
            w, h, s: skipPixels, mode
        });

    }

    static fromCanvas(canvas: Canvas, mode: GPUMode, skipPixels: number) {
        return new CanvasExaminer({
            pixels: canvas.getColourArray(),
            w: canvas.width,
            h: canvas.height,
            mode, skipPixels
        });
    }

    get size() {
        return this.width*this.height;
    }

    updatePixels(pixels: PixelColour[]) {

        const changedOffs: number[] = [];

        // Update all colours and record offsets
        for (const pix of pixels) {
            const { coord } = pix;
            const offset = coord.y*this.width + coord.x;
            this.#pixels[offset] = pix.colour;
            changedOffs.push(offset);
        }

        // Determine the number of update intervals that would fit in a 24hr
        // period
        const now = Date.now();
        const interval = now - this.#lastUpdate;
        const n = 1000*60*60*24 / interval;
        this.#lastUpdate = now;

        // The EMA is calculated over a 24hr period with n periods of the
        // interval. The value is the rate of updates in a 24h period.
        // nextEMA = 0 - prevEMA/n + prevEMA  if there was no update
        // nextEMA = 1 - prevEMA/n + prevEMA  if there was an update

        this.#avUpdates = this.#avUpdates.map(
            (v, i) => (changedOffs.includes(i) ? 1 : 0) - v/n + v
        );

    }

    crop({ x, y, w, h} : { x: number, y: number, w: number, h: number }) {

        const newPixels = Array<Colour>(w*h);

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const offset = (y+i)*this.width + x + j;
                newPixels[i*w + j] = this.#pixels[offset];
            }
        }

        return new CanvasExaminer({
            pixels: newPixels,
            w, h,
            mode: this.#mode,
            skipPixels: this.#skipPixels
        });

    }

    toRgbBuffer() {

        const rgb = Buffer.alloc(this.size*3);

        for (let i = 0; i < this.size; i++) {
            const pix = this.#pixels[i];
            rgb[i*3] = pix.red;
            rgb[i*3+1] = pix.green;
            rgb[i*3+2] = pix.blue;
        }

        return rgb;

    }

    /**
     * Shannon's entropy calculation of the canvas per pixel.
     * Between 0 and 4 bits as there are 16 possible colours.
     */
    entropy() {

        const freq = Array<number>(16).fill(0);
        this.#pixels.forEach(pix => freq[pix.id]++);

        const probs = freq.filter(f => f != 0).map(f => f / this.size);

        return probs.reduce((sum, x) => sum - x * Math.log2(x), 0);

    }

    calcScores() {

        const entropyScores = this.#entropyKernel(
            this.#pixels.map(c => c.id)
        ) as number[][];

        const updateScores = this.#updateKernel(
            this.#avUpdates
        ) as number[][];

        // Multiply scores together
        const scores = entropyScores.map(
            (row, y) => row.map((e, x) => e*updateScores[y][x])
        );

        return scores;

    }

}

