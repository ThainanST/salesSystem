import Checkout from "../../application/Checkout";
import Queue from "./Queue";

export default class QueueController {

    constructor ( readonly queueHandler: Queue, readonly checkout: Checkout ) {

        queueHandler.on("checkout", async function (input: any) {
            const output = await checkout.execute(input);            
        });
    }
}