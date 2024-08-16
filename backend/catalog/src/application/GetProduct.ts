import ProductData from "../domain/data/ProductData";
import Product from "../domain/entities/Product";

export default class GetProduct {

    constructor (readonly productData: ProductData) {

    }

    async execute (idProduct: number): Promise<Output> {
        const product = await this.productData.getProductById(idProduct);
        return this.factoryOutput(product);
    }

    async factoryOutput(product: Product): Promise<Output> {
        const output: Output = Object.assign(product, 
            {
                volume: product.getVolume(),
                density: product.getDensity()
            }
        );
        return output;
    }

    

}

type Output = {
    idProduct: number,
    description: string,
    price: number,
    width: number,
    height: number,
    length: number,
    weight: number,
    currency: string,
    volume: number,
    density: number
}