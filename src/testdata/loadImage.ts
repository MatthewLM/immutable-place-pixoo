import {Canvas, Colour} from "coin-canvas-lib";
import Jimp from "jimp";
import path from "path";

export default async function loadImage(name: string): Promise<Canvas> {

    const img = await Jimp.read(path.join(__dirname, name));
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const pixelN = w*h;

    // Convert to coin canvas raw data causing colours to change

    const inBuf = img.bitmap.data;
    const raw = new Uint8Array(pixelN / 2);

    function diff(i: number, c: Colour) {
        return Math.abs(inBuf[i*4] - c.red)
        + Math.abs(inBuf[i*4+1] - c.green)
        + Math.abs(inBuf[i*4+2] - c.blue);
    }

    for (let i = 0; i < pixelN; i++) {

        // Get closest colour in coin canvas pallete
        const idx = Colour.palette.sort((a, b) => diff(i, a) - diff(i, b))[0].id;

        const firstByte = i % 2 == 0;
        raw[Math.floor(i / 2)] |= idx << (firstByte ? 4 : 0);

    }

    return new Canvas(w, h, raw);

}

