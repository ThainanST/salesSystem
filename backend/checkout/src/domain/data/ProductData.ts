import Product from "../entities/Product";

export default interface ProductData {
    getProductById(idProduct: number): Promise<Product>;
}