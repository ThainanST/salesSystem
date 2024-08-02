import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import pgPromise from "pg-promise";
import DbConnection from "./DbConnection";

export default class PgpConnection implements DbConnection {
    
    pgp: any;

    constructor() {
    }
    
    async open(): Promise<void> {
        this.pgp = pgp()("postgres://postgres:123456@localhost:5432/app");
    }
    async query(statement: string, params: any): Promise<any> {
        return this.pgp.query(statement, params);
    }

    async close(): Promise<void> {
        return this.pgp.$pool.end();
    }
}