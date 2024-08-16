import DbConnection from "./DbConnection";
import pgp from "pg-promise";

export default class PgpSConnection implements DbConnection {

    private static instance: PgpSConnection;
    private pgp: any;
    private static readonly connectionString = "postgres://postgres:123456@localhost:5432/app";
    
    constructor() {}

    public static getInstance(): PgpSConnection {
        if (!PgpSConnection.instance) {
            PgpSConnection.instance = new PgpSConnection();
        }
        return PgpSConnection.instance;
    }

    async open(): Promise<void> {
        if (!this.pgp) {
            //console.log("Opening connection");
            this.pgp = pgp()(PgpSConnection.connectionString);
        } else {
            //console.log("Connection already open");
        }
    }
    async query(statement: string, params: any): Promise<any> {
        //console.log("Querying statement: ", statement, params);
        return this.pgp.query(statement, params);
    }
    
    async close(): Promise<void> {
        if (this.pgp) {
            //console.log("Closing connection");
            await this.pgp.$pool.end();
            this.pgp = null;
        } else {
            //console.log("Connection already closed");
        }
    }

}