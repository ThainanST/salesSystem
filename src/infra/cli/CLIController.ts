import Checkout from "../../application/Checkout";
import CLIHandler from "./CLIHandler";

export default class CLIController {

    constructor(readonly handler: CLIHandler, readonly checkout: Checkout) {
        let input: any = {
            items: [],
        };

        handler.on("set-cpf", function (params: string) {
            input.cpf = params;
            console.log(input);
        });

    }
}