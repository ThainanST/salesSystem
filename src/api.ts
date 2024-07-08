import express from "express";
import { checkout } from "./Checkout";

const app = express();
app.use(express.json());


app.post('/checkout', async function (req, res) {
    const input = req.body;
    try {
        const output = await checkout(input);
    } catch (error: any) {
        res.status(422).json({ 
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});