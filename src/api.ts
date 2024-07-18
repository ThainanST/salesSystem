import express from "express";
import Checkout from "./Checkout";
import ProductDataDatabase from "./ProductDataDatabase";
import CouponDataDatabase from "./CouponDataDatabase";

const app = express();
app.use(express.json());


app.post('/checkout', async function (req, res) {
    const input = req.body;
    const productData = new ProductDataDatabase();
    const couponData = new CouponDataDatabase();
    try {
        const checkout = new Checkout(productData, couponData);
        const output = await checkout.execute(input);
        res.json(output);
    } catch (error: any) {
        res.status(422).json({ 
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});