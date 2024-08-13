export default class Product {

    constructor (
        readonly idProduct: number,
        readonly description: string, 
        readonly price: number,
        readonly width: number,
        readonly height: number,
        readonly length: number,
        readonly weight: number,
        readonly currency: string = 'BRL' 
    ) {

    }

    getVolume(): number {
        return ( (this.width * this.height * this.length)  / 1000000 );
    }

    getDensity(): number {
        return ( this.weight / this.getVolume() );
    }
}