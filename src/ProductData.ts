export default interface ProductData {
    getProductById(id_product: number): Promise<any>;
}