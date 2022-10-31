import {P2putPixelAddrGenerator} from "coin-canvas-lib";

export default {
    xLen: 1000,
    yLen: 1000,

    wsURL: "wss://test-ws.immutable.place/",
    reconnectMs: 5000,

    httpURL: "https://test-api.immutable.place",
    httpRateLimit: 1000,
    httpTimeout: 8000,
    bitmapURL: "https://test-bmp.immutable.place",
    bitmapTimeout: 8000,

    addrGen: new P2putPixelAddrGenerator(
        "tpc", [0xc7, 0x66, 0xce, 0xc1, 0xef] // "canvas00" prefix
    )
};

