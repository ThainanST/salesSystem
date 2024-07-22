import CouponData from "../../domain/data/CouponData";
import pgp from 'pg-promise';
import Coupon from "../../domain/entities/Coupon";

export default class CouponDataDatabase implements CouponData {
    async getCouponByCode (code: string): Promise<Coupon> {
        const postgresUser = 'postgres';
        const postgresPassword = '123456';
        const postgresHost = 'localhost';
        const postgresPort = '5432';
        const postgresDatabase = 'app';
        const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
        const [couponData] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [code]);
        await connection.$pool.end();
        if (!couponData) throw new Error('Coupon not found');
        return new Coupon(
            couponData.code,
            couponData.discount,
            couponData.expire_date);
    }
}