// Copyright 2022 Matthew Mitchell
// Uses GPU acceleration to score pixels according to interest with the
// Uint8Array from an ImageData object
/* eslint-disable max-lines-per-function, func-names, no-invalid-this */

import { GPU, GPUMode } from "gpu.js";
export {GPUMode} from "gpu.js";

const modes: {
    [key: string]: GPU
} = {};

function getMode(mode: GPUMode): GPU {
    if (!(mode in modes))
        modes[mode] = new GPU({ mode });
    return modes[mode];
}

// These kernels produce update and entropy scores seperately and tend to be
// more stable but take longer to process.

/**
 * Returns a kernel function that takes an array of colour IDs as input
 * and returns the entropy scores of all top-left pixels in every possible 64x64
 * square as a 2D array as number[y][x].
 *
 * Large amounts of data may not work and return all zeros.
 *
 * This returns an output that is 63 less in both dimensions.
 */
export function createEntropyScorerKernel({
    w, h, s, mode
}: {
    w: number, h: number, s: number, mode: GPUMode
}) {

    return getMode(mode).createKernel(function(ids: number[]) {

        const width = this.constants.w as number;
        const skip = this.constants.s as number;

        if (this.thread.y % skip != 0 || this.thread.x % skip != 0) return 0;

        const startOffset = this.thread.y * width + this.thread.x;

        // Calculate Shannon's entropy.

        // GPU.js doesn't support arrays longer
        // than 4 elements, so a 4x4 matrix is used for each ID that is 0-15
        const freq = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                // ID frequency for entropy calculation
                const offset = startOffset + i*width + j;
                const id = ids[offset];
                freq[Math.floor(id / 4)][id % 4]++;
            }
        }

        let entropy = 0;
        for (let i = 0; i < 16; i++) {
            const x = freq[Math.floor(i / 4)][i % 4];
            if (x != 0) {
                const prob = x / (64**2);
                entropy -= prob * Math.log2(prob);
            }
        }

        // Score entropy from 0-2.5 according to how far away it is from 2.5
        const entropyScore = 2.5 - Math.abs(entropy - 2.5);

        // Raise entropyScore to second power to more strongly favour parts of
        // the canvas with ideal entropy.
        return entropyScore*entropyScore;

    }, {
        output: [w-63, h-63],
        constants: { w, h, s }
    });

}

/**
 * Returns a kernel function that takes an array of pixel scores as input
 * and returns the update scores of all top-left pixels in every possible 64x64
 * square as a 2D array as number[y][x].
 *
 * Large amounts of data may not work and return all zeros.
 *
 * This returns an output that is 63 less in both dimensions.
 */
export function createUpdateScorerKernel({
    w, h, s, mode
}: {
    w: number, h: number, s: number, mode: GPUMode
}) {

    return getMode(mode).createKernel(function(updates: number[]) {

        const width = this.constants.w as number;
        const skip = this.constants.s as number;

        if (this.thread.y % skip != 0 || this.thread.x % skip != 0) return 0;

        const startOffset = this.thread.y * width + this.thread.x;

        // Add the number of average updates for all pixels in 64x64 square

        let totalUpdates = 0;

        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                const offset = startOffset + i*width + j;
                totalUpdates += updates[offset];
            }
        }

        // Even if there are no updates, the base score will be 1 to be used as
        // a multiplier. Then this multiplier increases in a logarithmic
        // fashion.
        return Math.log2(2 + totalUpdates);

    }, {
        output: [w-63, h-63],
        constants: { w, h, s}
    });

}

// This isn't used right now due to instability on GPU mode.
/**
 * Returns a kernel function that takes one array of colour IDs and another
 * array of average updates as input and returns the scores of all top-left
 * pixels in every possible 64x64 square as a 2D array as number[y][x].
 *
 * Large amounts of data may not work and return all zeros, or become unstable
 * and either produce errors or false output.
 *
 * This combines the two kernels together but is only slightly faster and tends
 * to be more unstable.
 *
 * This returns an output that is 63 less in both dimensions.
 */
export function createScorerKernel(
    w: number, h: number, mode: GPUMode
) {

    return getMode(mode).createKernel(function(ids: number[], updates: number[]) {

        const width = this.constants.w as number;
        const startOffset = this.thread.y * width + this.thread.x;

        // Calculate Shannon's entropy and add the number of average updates for
        // all pixels in 64x64 square

        // GPU.js doesn't support arrays longer
        // than 4 elements, so a 4x4 matrix is used for each ID that is 0-15
        const freq = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        let totalUpdates = 0;

        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                // ID frequency for entropy calculation
                const offset = startOffset + i*width + j;
                const id = ids[offset];
                freq[Math.floor(id / 4)][id % 4]++;
                // Add average pixel updates
                totalUpdates += updates[offset];
            }
        }

        let entropy = 0;
        for (let i = 0; i < 16; i++) {
            const x = freq[Math.floor(i / 4)][i % 4];
            if (x != 0) {
                const prob = x / (64**2);
                entropy -= prob * Math.log2(prob);
            }
        }

        // Score entropy from 0-2.5 according to how far away it is from 2.5
        const entropyScore = 2.5 - Math.abs(entropy - 2.5);

        // Raise entropyScore to second power to more strongly favour parts of
        // the canvas with ideal entropy.
        const adjEntropyScore = entropyScore**2;

        // Even if there are no updates, the base score will be 1 to be used as
        // a multiplier. Then this multiplier increases in a logarithmic
        // fashion.
        const updateScore = Math.log2(2 + totalUpdates);

        return adjEntropyScore*updateScore;

    }, {
        output: [w-63, h-63],
        constants: { w, h }
    });

}

