import {P2putPixelAddrGenerator} from "coin-canvas-lib";

export default {
    xLen: 1000,
    yLen: 1000,

    wsURL: "wss://ws.immutable.place/",
    reconnectMs: 5000,

    httpURL: "https://api.immutable.place",
    httpRateLimit: 1000,
    httpTimeout: 10000,
    bitmapURL: "https://bmp.immutable.place",
    bitmapTimeout: 10000,

    addrGen: new P2putPixelAddrGenerator(
        "pc", [0xc7, 0x66, 0xce, 0xc1, 0xef] // "canvas00" prefix
    )
};

