// Copyright 2022 Matthew Mitchell

const DONATION_ADDR = "pc1qev4zg0zllkchrnlcdh7hhplrr8wdrhtrjajl6l";

export function printImageToConsole(image: Buffer, width: number, height: number) {

    const { stdout } = process;
    if (!stdout.isTTY || !stdout.hasColors()) return;
    const [cols] = stdout.getWindowSize();
    const maxWidth = Math.min(Math.floor(cols/2), width);

    let out = "";

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < maxWidth; x++) {

            const offset = (y*width+x)*3;

            const red = image[offset];
            const green = image[offset+1];
            const blue = image[offset+2];

            out += `\x1b[48;2;${red};${green};${blue}m  `;

        }

        out += "\x1b[49m";

        if (y != height-1)
            out += "\n";

    }

    console.log(out);

}

export function printDonationMsgToConsole() {
    console.log(`
Thank you for using this software. This software is provided open-source and free of charge.
If you enjoy it, you may donate Peercoin to the following address:

    ${DONATION_ADDR}
`);
}

