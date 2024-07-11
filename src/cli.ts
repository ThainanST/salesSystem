import Checkout from "./Checkout";
import CouponDataDatabase from "./CouponDataDatabase";
import ProductDataDatabase from "./ProductDataDatabase";

let input: any = {
    items: [],
};

let output: any = {};

export async function handleCommand(command: string) {
    if (command.startsWith("set-cpf")) {
        const params = command.replace("set-cpf ", "");
        input.cpf = params;
        return input;
    }
    if (command.startsWith("add-item")) {
        const params = command.replace("add-item ", "");
        const [id_product, quantity] = params.split(" ");
        input.items.push({ id_product, quantity });
        return input;
    }
    if (command.startsWith("show-input")) {
        console.log(input);
    }
    if (command.startsWith("clear-input")) {
        input = {
            items: [],
        };
    }
    if (command.startsWith("checkout") ) {
        const productData = new ProductDataDatabase();
        const couponData = new CouponDataDatabase();
        try {
            const checkout = new Checkout(productData, couponData);
            const output = await checkout.execute(input);
            return output;
        } catch (error: any) {
            return { 
                message: error.message
            };
        }
    }
}

process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n|\r/g, "");
    handleCommand(command);
});