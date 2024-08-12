export default interface FreightGateway {
    calculateFreight ( items: { volume: number, density: number, quantity: number }[], cepFrom?: string, cepTo?: string ): Promise<any>;
}
