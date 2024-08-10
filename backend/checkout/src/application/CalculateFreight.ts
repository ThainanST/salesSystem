import ProductData from "../domain/data/ProductData";
import ZipcodeData from "../domain/data/ZipcodeData";
import DistanceCalculator from "../domain/entities/DistanceCalculator";
import FreightCalculator from "../domain/entities/FreightCalculator";

export default class CalculateFreight {

    constructor (readonly productData: ProductData, readonly zipcodeData: ZipcodeData) {

    }

    async execute (input: any): Promise<any> {
        let distance;
        if (input.cepFrom && input.cepTo) {
            const cepFrom = await this.zipcodeData.get(input.cepFrom);
            const cepTo = await this.zipcodeData.get(input.cepTo);
            if (cepFrom && cepTo) {
                distance = DistanceCalculator.calculate(cepFrom.coord, cepTo.coord);
            }
        }
        const freightCalculator = new FreightCalculator();
        const products = input.items;
        let freight = 0;
        for (let item of products) {
            const product = await this.productData.getProductById(item.idProduct);
            if (product) {
                if (item.quantity <= 0) {
                    throw new Error('Quantity must be positive');
                }
                freight += freightCalculator.calculate(product, distance) * item.quantity;
            }
            else {
                throw new Error('Product not found');
            }
        }
        return {
            freight: freight
        };
    }
}

type Input = {
    cepFrom?: string;
    cepTo?: string;
    items: { idProduct: number, quantity: number }[];
}

type Output = {
    freight: number;
};
