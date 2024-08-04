import Order from "../../domain/entities/Order";
import OrderData from "../../domain/data/OrderData";
import DbConnection from "../database/DbConnection";
import PgpConnection from "../database/PgpConnection";

export default class OrderDataDatabase implements OrderData {

    constructor(readonly dbConnection: DbConnection = new PgpConnection()) {

    }
    
    async save (order: Order): Promise<void> {
        await this.dbConnection.open();
        await this.dbConnection.query(
            "INSERT INTO sales.order (cpf, total) VALUES ($1, $2);", [
                order.cpf.getCpf(),
                order.getTotal()
            ]);
        await this.dbConnection.close();
        
    }

    async getOrderByCpf (cpf: string): Promise<any> {
        await this.dbConnection.open();
        const [orderData] = await this.dbConnection.query("SELECT * FROM sales.order WHERE cpf = $1;", [cpf]);
        await this.dbConnection.close();
        return orderData;
    }
    
    async count(): Promise<number> {
        await this.dbConnection.open();
        const [options] = await this.dbConnection.query("select count(*)::integer as count FROM sales.order;", []);
        await this.dbConnection.close();
        return options.count;
    }
}