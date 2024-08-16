import ProductData from "../domain/data/ProductData";
import Product from "../domain/entities/Product";

export default class GetProducts {

    constructor (readonly productData: ProductData) {

    }

    async execute (): Promise<Output[]> {
        const products = await this.productData.getProducts();
        const output = products.map(product => this.factoryOutput(product));
        return Promise.all(output);
    }

    async factoryOutput(product: Product): Promise<Output> {
        const output: Output = 
            {
                idProduct: product.idProduct,
                description: product.description,
                price: product.price,
                width: product.width,
                height: product.height,
                length: product.length,
                weight: product.weight,
                currency: product.currency,
                volume: product.getVolume(),
                density: product.getDensity()
            }
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