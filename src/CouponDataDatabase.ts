import Coupon from "./Coupon";
import CouponData from "./CouponData";
import pgp from 'pg-promise';

export default class CouponDataDatabase implements CouponData {
    async getCouponByCode (code: string): Promise<Coupon> {
        const postgresUser = 'postgres';
        const postgresPassword = '123456';
        const postgresHost = 'localhost';
        const postgresPort = '5432';
        const postgresDatabase = 'app';
        const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
        const [objCoupon] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [code]);
        await connection.$pool.end();
        return new Coupon(
            objCoupon.code,
            objCoupon.discount,
            objCoupon.expire_date);
    }
}