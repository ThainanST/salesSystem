import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import RestControler from "./infra/controller/RestContoler";
import HapiHttpServer from "./infra/http/HapiHttpServer";

// const httpServer = new ExpressHttpServer();
const httpServer = new HapiHttpServer();
const productData = new ProductDataDatabase();
const couponData = new CouponDataDatabase();
const orderData = new OrderDataDatabase();
const checkout = new Checkout(productData, couponData, orderData);
const port = 3000;

new RestControler(httpServer, checkout, port);


// const app = express();
// app.use(express.json());


// app.post('/checkout', async function (req, res) {
//     const input = req.body;
//     const productData = new ProductDataDatabase();
//     const couponData = new CouponDataDatabase();
//     try {
//         const checkout = new Checkout(productData, couponData);
//         const output = await checkout.execute(input);
//         res.json(output);
//     } catch (error: any) {
//         res.status(422).json({ 
//             message: error.message
//         });
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });