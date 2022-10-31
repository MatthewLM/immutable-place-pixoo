
export function waitForInterrupt() {
    return new Promise(resolve => process.on("SIGINT", resolve));
}

