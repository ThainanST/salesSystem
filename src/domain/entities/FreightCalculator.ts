import Product from "./Product";

export default class FreightCalculator {

    constructor ( ) {

    }

    calculate (product: Product): number {
        const volume = product.getVolume();
        const density = product.getDensity();
        const itemFreight = 1000 * volume * (density /100);
        return itemFreight >= 10 ? itemFreight : 10;
    }
}