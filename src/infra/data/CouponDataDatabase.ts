import CouponData from "../../domain/data/CouponData";
import Coupon from "../../domain/entities/Coupon";
import PgpConnection from "../database/PgpConnection";
import DbConnection from "../database/DbConnection";

export default class CouponDataDatabase implements CouponData {

    constructor(readonly dbConnection: DbConnection = new PgpConnection()) {

    }

    async getCouponByCode (code: string): Promise<Coupon> {
        await this.dbConnection.open();
        const [couponData] = await this.dbConnection.query(
                "SELECT * FROM sales.coupons WHERE code = $1;",
                 [code]
            );
        await this.dbConnection.close();
        if (!couponData) throw new Error('Coupon not found');
        return this.couponFactory(couponData);
    }

    couponFactory(couponData: any): Coupon {
        return new Coupon(
            couponData.code,
            couponData.discount,
            couponData.expire_date
        );
    }
}