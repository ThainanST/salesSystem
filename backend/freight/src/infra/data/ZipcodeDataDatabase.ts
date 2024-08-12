import ZipcodeData from "../../domain/data/ZipcodeData";
import Zipcode from "../../domain/entities/Zipcode";
import DbConnection from "../database/DbConnection";

export default class ZipcodeDataDatabase implements ZipcodeData {

    constructor(readonly dbConnection: DbConnection) {
        this.dbConnection = dbConnection;
    }

    async get(code: string): Promise<Zipcode | undefined> {
        await this.dbConnection.open();
        const [zipcodeData] = await this.dbConnection.query(
            "SELECT * FROM sales.zipcodes WHERE code = $1;",
            [code]
        );
        await this.dbConnection.close();
        if (!zipcodeData) throw new Error('Zipcode not found');
        return this.zipcodeFactory(zipcodeData);
    }

    zipcodeFactory(zipcodeData: any): Zipcode {
        return new Zipcode(
            zipcodeData.code,
            zipcodeData.street,
            zipcodeData.neighborhood,
            parseFloat(zipcodeData.lat),
            parseFloat(zipcodeData.long)
        );
    }

}