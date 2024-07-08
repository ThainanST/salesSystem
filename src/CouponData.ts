export default interface CouponData {
    getCouponByCode(code: string): Promise<any>;
}