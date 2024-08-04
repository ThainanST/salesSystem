import Coupon from "../entities/Coupon";

export default interface CouponData {
    getCouponByCode(code: string): Promise<Coupon>;
}