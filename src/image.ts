// Copyright 2022 Matthew Mitchell

import {PixelColour} from "coin-canvas-lib";
import CanvasExaminer from "./CanvasExaminer";
import CanvasSelector from "./CanvasSelector";
import Pixoo from "./Pixoo";
import loadImage from "./testdata/loadImage";
import {GPUMode} from "./gpuScorer";
import {argParse} from "./args";
import display from "./display";

async function main() {

    const args = argParse(
        true,
        "Display parts of an image in the testdata directory"
    );
    const pixoo = new Pixoo(args.pixooUrl, 64);
    const image = await loadImage(args.image);

    const examiner = CanvasExaminer.fromCanvas(
        image, args.mode as GPUMode, args.skippixels
    );
    const selector = new CanvasSelector(examiner);

    async function loop() {

        await display(pixoo, selector, !args.noconsole);

        if (args.simpaint) {
            // Simulate painting of 50 pixels

            const pixs = [...Array(50).keys()].map(
                () => new PixelColour(
                    {
                        x: Math.floor(Math.random()*image.width),
                        y: Math.floor(Math.random()*image.height)
                    },
                    Math.floor(Math.random()*16)
                )
            );

            examiner.updatePixels(pixs);
        }

        setTimeout(loop, 10000);

    }

    await loop();

}

main().catch(reason => console.log(`Exited with error: ${reason}`));

