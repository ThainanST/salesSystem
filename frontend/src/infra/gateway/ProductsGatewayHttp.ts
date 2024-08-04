import axios from "axios";
import Products from "../../domain/Products";
import ProductsGateway from "./ProductsGateway";

export default class ProductsGatewayHttp implements ProductsGateway {

    constructor(readonly httpClient: any, readonly baseUrl: string) {

    }
    
    async getProducts(): Promise<Products[]> {
        const productsData  = await this.httpClient.get(`${this.baseUrl}/products`);
        const products: Products[] = [];
        for (const product of productsData) {
            products.push(new Products(product.idProduct, product.description, product.price));
        }
        return products;
    }
    
}