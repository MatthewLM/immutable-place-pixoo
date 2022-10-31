// Copyright 2022 Matthew Mitchell

import CanvasSelector from "./CanvasSelector";
import {printImageToConsole} from "./console";
import Pixoo from "./Pixoo";

const ROTATION_N = 10;

export default async function display(
    pixoo: Pixoo, selector: CanvasSelector, toConsole: boolean
) {

    const now = Date.now();
    const segment = selector.select(ROTATION_N);
    const processMs = Date.now() - now;

    const rgb = segment.toRgbBuffer();
    if (toConsole)
        printImageToConsole(rgb, 64, 64);
    await pixoo.sendStillImage(rgb);

    console.log(`ENTROPY = ${segment.entropy().toFixed(4)}`);
    console.log(`TOOK ${processMs}ms`);

}

