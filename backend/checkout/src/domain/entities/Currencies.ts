export default class Currencies {

    exchange: {[currency: string]: number} = {};

    constructor () {

    }

    addCurrency(currency: string, exchange: number) {
        this.exchange[currency] = exchange;
    }

    getExchange(currency: string): number {
        return this.exchange[currency];
    }

}