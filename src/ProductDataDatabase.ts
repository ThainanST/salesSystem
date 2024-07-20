import ProductData from './ProductData';
import pgp from 'pg-promise';

export default class ProductDataDatabase implements ProductData {

    async getProductById (idProduct: number) {
        const postgresUser = 'postgres';
        const postgresPassword = '123456';
        const postgresHost = 'localhost';
        const postgresPort = '5432';
        const postgresDatabase = 'app';
        const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
        const [product] = await connection.query("SELECT * FROM sales.products WHERE idProduct = $1;", [idProduct]);
        await connection.$pool.end();
        return product;
    }


}