export default class CurrencyGateway {
    async getCurrencies() {
        return {
            "BRL": 1.0,
            "USD": 3.0 + Math.random(),
            "EUR": 6.5
        };
    }
}