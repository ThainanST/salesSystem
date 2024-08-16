import Product from '../../domain/entities/Product';
import ProductData from '../../domain/data/ProductData';
import DbConnection from '../database/DbConnection';
import PgpConnection from '../database/PgpConnection';


export default class ProductDataDatabase implements ProductData {

    constructor( readonly dbConnection: DbConnection ) {

    }
    
    async getProducts(): Promise<Product[]> {
        await this.dbConnection.open();
        const productsData = await this.dbConnection.query("SELECT * FROM sales.products;", []);
        await this.dbConnection.close();
        const products = productsData.map((productData: any) => this.productFactory(productData));
        return products;
    }

    async getProductById (idProduct: number): Promise<Product> {
        await this.dbConnection.open();
        const [productData] = await this.dbConnection.query( "SELECT * FROM sales.products WHERE id_product = $1;", [idProduct] );
        await this.dbConnection.close();
        if (!productData) throw new Error('Product not found');
        const product = this.productFactory(productData);
        return product;
    }

    productFactory(productData: any): Product {
        return new Product(
            productData.id_product,
            productData.description,
            parseFloat(productData.price),
            parseFloat(productData.width),
            parseFloat(productData.height),
            parseFloat(productData.length),
            parseFloat(productData.weight),
            productData.currency
        );  
    }


}