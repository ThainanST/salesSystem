import express from "express";
import { validate } from "./CpfValidator";
import pgp from "pg-promise";

const app = express();
app.use(express.json());


const postgresUser = 'postgres';
const postgresPassword = '123456';
const postgresHost = 'localhost';
const postgresPort = '5432';
const postgresDatabase = 'app';
const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
// const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

// const products = [
//     {id_product: 1, description: "A", price: 1000},
//     {id_product: 2, description: "B", price: 5000},
//     {id_product: 3, description: "C", price: 30}
// ];

// const coupons = [
//     {code: "VALE20", discount: 0.2},
//     {code: "VALE30", discount: 0.3},
//     {code: "VALE40", discount: 0.4}
// ];

app.post('/checkout', async function (req, res) {
    const isCpfValid = validate(req.body.cpf);
    if (isCpfValid) {
        const products = req.body.items;
        const productsId = products.map( (prod: any) => prod.id_product);
        const productsIdSet = new Set(productsId);
        if (productsId.length !== productsIdSet.size) {
            return res.status(422).json({
                message: 'Duplicate products'
            });
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
                    return res.status(422).json({
                        message: 'Quantity must be positive'
                    });
                }
                total += parseFloat(product.price) * item.quantity;
                volume = parseFloat(product.width) * parseFloat(product.height) * parseFloat(product.length) / 1000000;
                density = parseFloat(product.weight) / volume;
                itemFreight = 1000 * volume * (density /100);
                freight += itemFreight >= 10 ? itemFreight : 10;
            }
            else {
                return res.status(422).json({
                    message: 'Product not found'
                })
            }
        }
        if (req.body.coupon) {
            const myCuponCode = req.body.coupon;
            // const objCoupon = coupons.find(cup => cup.code === myCuponCode);
            const [objCoupon] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [myCuponCode]);
            const today = new Date();
            if (objCoupon  ) {
                if (today < objCoupon.expire_date.getTime() ) {
                    total = total * (1 - objCoupon.discount );
                }
                else {
                    total += freight;
                    return res.status(422).json({
                        total: total,
                        freight: freight,
                        message: 'Coupon expired'
                    });
                }
            }
            else {
                total += freight;
                return res.status(422).json({
                    total: total,
                    freight: freight,
                    message: 'Coupon not found'
                });
            }
        }
        total += freight;
        res.json({
            total: total,
            freight: freight
        });
    }
    else {
        return res.status(422).json({ 
            message: 'Invalid cpf'
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});