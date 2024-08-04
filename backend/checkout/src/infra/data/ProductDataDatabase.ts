import pgp from 'pg-promise';
import Product from '../../domain/entities/Product';
import ProductData from '../../domain/data/ProductData';
import DbConnection from '../database/DbConnection';
import PgpConnection from '../database/PgpConnection';


export default class ProductDataDatabase implements ProductData {

    constructor(
        readonly dbConnection: DbConnection = new PgpConnection()
    ) {

    }

    async getProductById (idProduct: number): Promise<Product> {
        await this.dbConnection.open();
        const [productData] = await this.dbConnection.query(
                    "SELECT * FROM sales.products WHERE id_product = $1;",
                    [idProduct]
            );
        await this.dbConnection.close();
        if (!productData) throw new Error('Product not found');
        return this.productFactory(productData);
    }

    productFactory(productData: any): Product {
        return new Product(
            productData.id_product,
            productData.description,
            productData.price,
            productData.width,
            productData.height,
            productData.length,
            productData.weight,
            productData.currency
        );  
    }


}