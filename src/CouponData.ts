import Coupon from "./Coupon";

export default interface CouponData {
    getCouponByCode(code: string): Promise<Coupon>;
}