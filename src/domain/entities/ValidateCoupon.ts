export default class ValidateCoupon {

    constructor(readonly couponData: any) {
    }

    async execute(code: string, total: number): Promise<any> {
        const coupon = await this.couponData.getCouponByCode(code);        
        return { 
            isExpired: coupon.isExpired(),
            discount: coupon.getDiscount(total),
        };
    }
}