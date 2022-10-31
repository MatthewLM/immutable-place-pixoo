#!/usr/bin/env ts-node
// Copyright 2022 Matthew Mitchell

import {CoinCanvasClient, PixelColour} from "coin-canvas-lib";
import CanvasExaminer from "./CanvasExaminer";
import CanvasSelector from "./CanvasSelector";
import Pixoo from "./Pixoo";
import {GPUMode} from "./gpuScorer";
import {argParse} from "./args";
import display from "./display";
import PROD_CONFIG from "./prodConfig";
import TEST_CONFIG from "./testConfig";
import {waitForInterrupt} from "./utils";
import {printDonationMsgToConsole} from "./console";

async function main() {

    const args = argParse(
        false,
        "Display parts of the Immutable.Place canvas on a Pixoo 64"
    );
    const pixoo = new Pixoo(args.pixooUrl, 64);

    let examiner: CanvasExaminer | null = null;
    let selector: CanvasSelector | null = null;

    console.log("The first image should be uploaded shortly...");

    const client = new CoinCanvasClient({
        ...(args.network == "prod" ? PROD_CONFIG : TEST_CONFIG),
        onFullCanvas: async (canvas) => {
            console.log("Loaded Canvas");
            examiner = CanvasExaminer.fromCanvas(
                canvas, args.mode as GPUMode, args.skippixels
            );
            selector = new CanvasSelector(examiner);
            await display(pixoo, selector, !args.noconsole);
            printDonationMsgToConsole();
        },
        onUpdatedPixels: async (pixels: PixelColour[]) => {
            console.log("New Block");
            if (selector === null || examiner === null) return;
            examiner.updatePixels(pixels);
            await display(pixoo, selector, !args.noconsole);
        },
        onError: (what: string) => console.log(`Error: ${what}`)
    });

    // Wait for interrupt
    await waitForInterrupt();
    client.close();
    process.exit();

}

main().catch(reason => console.log(`Exited with error: ${reason}`));

