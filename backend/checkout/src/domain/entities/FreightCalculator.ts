import Product from "./Product";

export default class FreightCalculator {

    constructor ( ) {

    }

    calculate (product: Product, distance: number = 1000): number {
        const volume = product.getVolume();
        const density = product.getDensity();
        const itemFreight = distance * volume * (density /100);
        return itemFreight >= 10 ? Math.round(itemFreight*100)/100 : 10;
    }
}