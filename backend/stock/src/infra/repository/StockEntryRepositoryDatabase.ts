import StockEntry from "../../domain/entities/StockEntry";
import StockEntryRepository from "../../domain/repository/StockEntryRepository";
import DbConnection from "../database/DbConnection";

export default class StockEntryRepositoryDatabase implements StockEntryRepository {

    constructor(readonly dbConnection: DbConnection) {

    }

    save(stockEntry: StockEntry): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getByIdProduct(idProduct: number): Promise<StockEntry[]> {
        await this.dbConnection.open();
        const stockEntriesData = await this.dbConnection.query('SELECT * FROM sales.stock_entry WHERE id_product = $1', [idProduct]);
        const stockEntries: StockEntry[] = [];
        for(const stockEntryData of stockEntriesData) {
            stockEntries.push(new StockEntry(
                stockEntryData.id_product,
                stockEntryData.operation,
                stockEntryData.quantity)
            );
        }
        await this.dbConnection.close();
        return stockEntries;
    }

    clean(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}