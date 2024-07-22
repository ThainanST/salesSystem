export default class FreightCalculator {

    constructor ( ) {

    }

    calculate (product: any): number {
        const volume = parseFloat(product.width) * parseFloat(product.height) * parseFloat(product.length) / 1000000;
        const density = parseFloat(product.weight) / volume;
        const itemFreight = 1000 * volume * (density /100);
        return itemFreight >= 10 ? itemFreight : 10;
    }
}