import axios from "axios";

export default class Pixoo {
    #url: string;
    #width: number;
    #picId: number | null = null;

    constructor(url: string, width: number) {
        this.#url = `${url}/post`;
        this.#width = width;
    }

    /**
     * Sends an image to the Pixoo, using a buffer of RGB values.
     * Each pixel should be sent left-to-right and top-to-bottom with 3 bytes
     * each for red, green and blue.
     */
    async sendStillImage(image: Buffer) {

        if (image.length !== this.#width**2*3)
            throw Error(`Image must be ${this.#width}^2 with 3 bytes per pixel`);

        if (this.#picId === null) {

            const response = await this.#post({
                Command: "Draw/GetHttpGifId"
            });

            this.#picId = response.PicId;

            if (this.#picId === null)
                throw Error("Couldn't get picture ID");

        }

        await this.#post({
            Command: "Draw/SendHttpGif",
            PicNum: 1,
            PicWidth: this.#width,
            PicOffset: 0,
            PicID: this.#picId++,
            PicSpeed: 1000,
            PicData: image.toString("base64")
        });

    }

    async #post(data: object) {

        const response = await axios.post(this.#url, data);

        if (response.status !== 200)
            throw Error(`Pixoo returned non-200 HTTP status ${response.status}`);

        const respData = response.data;

        if (respData.error_code)
            throw Error(`Pixoo returned error code ${respData.error_code}`);

        return respData;

    }

}

