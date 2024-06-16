import { validate } from "./CpfValidator";
import pgp from "pg-promise";

const postgresUser = 'postgres';
const postgresPassword = '123456';
const postgresHost = 'localhost';
const postgresPort = '5432';
const postgresDatabase = 'app';
const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);

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
        const isCpfValid = validate(input.cpf);
        if (isCpfValid) {
            const products = input.items;
            const productsId = products.map( (prod: any) => prod.id_product );
            const productsIdSet = new Set(productsId);
            if (productsId.length !== productsIdSet.size) {
                output = {
                    message: "Duplicate products"
                }
                return output;
            }
            let total = 0;
            let freight = 0;
            let itemFreight = 0;
            let volume = 0;
            let density = 0;
            for (let item of products) {
                const [product] = await connection.query("SELECT * FROM sales.products WHERE id_product = $1;", [item.id_product]);
                if (product) {
                    if (parseInt(item.quantity) <= 0) {
                        output = {
                            message: "Quantity must be positive"
                        }
                        return output;
                    }
                    total += parseFloat(product.price) * parseInt(item.quantity);
                    volume = parseFloat(product.width) * parseFloat(product.height) * parseFloat(product.length) / 1000000;
                    density = parseFloat(product.weight) / volume;
                    itemFreight = 1000 * volume * (density /100);
                    freight += itemFreight >= 10 ? itemFreight : 10;
                }
                else {
                    output = {
                        message: "Product not found"
                    }
                    return output;
                }
            }
            if (input.coupon) {
                const myCuponCode = input.coupon;
                const [objCoupon] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [myCuponCode]);
                const today = new Date();
                if (objCoupon  ) {
                    if (today < objCoupon.expire_date.getTime() ) {
                        total = total * (1 - objCoupon.discount );
                    }
                    else {
                        total += freight;
                        output = {
                            total: total,
                            freight: freight,
                            message: 'Coupon expired'
                        };
                        return output;
                    }
                }
                else {
                    total += freight;
                    output = {
                        total: total,
                        freight: freight,
                        message: 'Coupon not found'
                    };
                    return output;
                }
            }
            total += freight;
            output = {
                total: total,
                freight: freight
            };
            return output;
        }
        else {
            output = {
                message: "Invalid cpf"
            };
            return output;
        }
    }
}

process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n|\r/g, "");
    handleCommand(command);
});