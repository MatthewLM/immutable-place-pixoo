// Copyright 2022 Matthew Mitchell

import {ArgumentParser} from "argparse";

export function argParse(testImage: boolean, description: string) {

    const parser = new ArgumentParser({ description });
    parser.add_argument("pixooUrl", { type: String });

    if (testImage) {
        parser.add_argument("image", { type: String });
        parser.add_argument("--simpaint", { action: "store_true" });
    } else {
        parser.add_argument("network", {
            type: String,
            default: "prod",
            choices: ["prod", "test"],
            nargs: "?"
        });
    }

    // CPU mode is more reliable
    parser.add_argument("--mode", {
        type: String,
        default: "cpu",
        choices: ["cpu", "gpu"],
        help: "\"cpu\" is more reliable though \"gpu\" can be faster"
    });
    parser.add_argument("--skippixels", {
        type: Number,
        default: 5,
        help: "Skip pixels in both directions for performance"
    });
    parser.add_argument("--noconsole", {
        action: "store_true",
        help: "Do not display artwork to console"
    });

    return parser.parse_args();

}

