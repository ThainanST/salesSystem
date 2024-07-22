import CouponDataDatabase from "../src/infra/data/CouponDataDatabase";
import ValidateCoupon from "../src/ValidateCoupon";

test('Deve validar um coupon de desconto', async function () {
    const couponData = new CouponDataDatabase();
    const validateCoupon = new ValidateCoupon(couponData);
    const validadeCouponOutput = await validateCoupon.execute("VALE20", 1000);
    expect(validadeCouponOutput.isExpired).toBeFalsy();
    expect(validadeCouponOutput.discount).toBe(200);
});