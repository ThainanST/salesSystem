import { validate } from './CpfValidator';
import pgp from 'pg-promise';

export async function checkout (input: Input) {
    const postgresUser = 'postgres';
    const postgresPassword = '123456';
    const postgresHost = 'localhost';
    const postgresPort = '5432';
    const postgresDatabase = 'app';
    const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);

    const isCpfValid = validate(input.cpf);
    if (isCpfValid) {
        const products = input.items;
        const productsId = products.map( (prod: any) => prod.id_product);
        const productsIdSet = new Set(productsId);
        if (productsId.length !== productsIdSet.size) {
            throw new Error('Duplicate products');
        }
        let total = 0;
        let freight = 0;
        let itemFreight = 0;
        let volume = 0;
        let density = 0;
        for (let item of products) {
            // const product = products.find(prod => prod.id_product === item.id_product);
            const [product] = await connection.query("SELECT * FROM sales.products WHERE id_product = $1;", [item.id_product]);
            if (product) {
                if (item.quantity <= 0) {
                    throw new Error('Quantity must be positive');
                }
                total += parseFloat(product.price) * item.quantity;
                volume = parseFloat(product.width) * parseFloat(product.height) * parseFloat(product.length) / 1000000;
                density = parseFloat(product.weight) / volume;
                itemFreight = 1000 * volume * (density /100);
                freight += itemFreight >= 10 ? itemFreight : 10;
            }
            else {
                throw new Error('Product not found');
            }
        }
        if (input.coupon) {
            const myCuponCode = input.coupon;
            // const objCoupon = coupons.find(cup => cup.code === myCuponCode);
            const [objCoupon] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [myCuponCode]);
            const today = new Date();
            if (objCoupon  ) {
                if (today < objCoupon.expire_date.getTime() ) {
                    total = total * (1 - objCoupon.discount );
                }
                else {
                    total += freight;
                    throw new Error('Coupon expired');
                    // return res.status(422).json({
                    //     total: total,
                    //     freight: freight,
                    //     message: 'Coupon expired'
                    // });
                }
            }
            else {
                total += freight;
                throw new Error('Coupon not found');
                // return res.status(422).json({
                //     total: total,
                //     freight: freight,
                //     message: 'Coupon not found'
                // });
            }
        }
        total += freight;

        return {
            total: total,
            freight: freight
        };
    }
    else {
        throw new Error('Invalid cpf');
    }

}

type Input = {
    cpf: string;
    items: {id_product: number, quantity: number}[];
    coupon?: string;
}