import OrderData from "./OrderData";
import pgp from 'pg-promise';

export default class OrderDataDatabase implements OrderData {
    
    async save (order: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("INSERT INTO sales.order (cpf, total) VALUES ($1, $2);", [order.cpf, order.total]);
        await connection.$pool.end();
        
    }

    async getOrderByCpf (cpf: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [orderData] = await connection.query("SELECT * FROM sales.order WHERE cpf = $1;", [cpf]);
        await connection.$pool.end();
        return orderData;
    }
    
    async count(): Promise<number> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [options] = await connection.query("select count(*)::integer as count FROM sales.order;", []);
        await connection.$pool.end();
        return options.count;
    }
}