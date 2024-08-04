import CurrencyGateway from "./CurrencyGateway";
import Currencies from "../../domain/entities/Currencies";

export default class CurrencyGatewayRandom implements CurrencyGateway {
    async getCurrencies(): Promise<Currencies> {
        const currencies = new Currencies();
        currencies.addCurrency("BRL", 1.0);
        currencies.addCurrency("USD", 3.0 + Math.random());
        currencies.addCurrency("EUR", 6.5);
        return currencies;
    }
}