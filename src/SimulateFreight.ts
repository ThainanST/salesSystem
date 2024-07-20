import FreightCalculator from "./FreightCalculator";

export default class SimulateFreight {

    constructor (readonly productData: any) {

    }

    async execute (input: any): Promise<any> {
        const freightCalculator = new FreightCalculator();
        const products = input.items;
        let freight = 0;
        for (let item of products) {
            const product = await this.productData.getProductById(item.idProduct);
            if (product) {
                if (item.quantity <= 0) {
                    throw new Error('Quantity must be positive');
                }
                freight += freightCalculator.calculate(product);
            }
            else {
                throw new Error('Product not found');
            }
        }
        return freight;
    }
}
