import ZipcodeData from "../domain/data/ZipcodeData";
import DistanceCalculator from "../domain/entities/DistanceCalculator";
import FreightCalculator from "../domain/entities/FreightCalculator";

export default class CalculateFreight {

    constructor (readonly zipcodeData: ZipcodeData) {

    }

    async execute (input: any): Promise<any> {
        let distance;
        if (input.cepFrom && input.cepTo) {
            const cepFrom = await this.zipcodeData.get(input.cepFrom);
            const cepTo = await this.zipcodeData.get(input.cepTo);
            if (cepFrom && cepTo) {
                distance = DistanceCalculator.calculate(cepFrom.coord, cepTo.coord);
            }
        }
        let freight = 0;
        for (let item of input.items) {
            freight += FreightCalculator.calculate(item.volume, item.density, distance) * item.quantity;
        }
        return {
            freight: freight
        };
    }
}

type Input = {
    cepFrom?: string;
    cepTo?: string;
    items: { volume: number, density: number, quantity: number }[];
}

type Output = {
    freight: number;
};
