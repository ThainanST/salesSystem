export default class Cpf {

    private cpf: string;

    constructor (cpf: string) {
        if (!this.validate(cpf)) throw new Error('Invalid cpf');
        this.cpf = cpf;
    }

    getCpf() {
        return this.cpf;
    }

    validate(rawCpf: string | null | undefined) {
        if (rawCpf === null || rawCpf === undefined) return false;
        const cleanCpf = this.getCleanCpf(rawCpf);
        if (!this.isValidLength(cleanCpf)) return false;
        if (this.doesAllDigitsAreEqual(cleanCpf)) return false;
        const digit1 = this.calculateDigit(cleanCpf, 10);
        const digit2 = this.calculateDigit(cleanCpf, 11);
        const validatedDigits = `${digit1}${digit2}`;
        const actualDigits = this.extractDigits(cleanCpf);
        return actualDigits == validatedDigits;
    }
    
    calculateDigit(cpf: string, factor: number) {
        let sum = 0;
        for (let digit of cpf) {
            if (factor > 1) sum += parseInt(digit) * factor--;
        }
        const rest = sum % 11;
        return (rest < 2) ? 0 : 11 - rest;
    }
    
    isValidLength(cpf: string) {
        return cpf.length === 11;
    }
    
    doesAllDigitsAreEqual(cpf: string) {
        const firstDigit = cpf[0];
        return [...cpf].every(digit => digit === firstDigit);
    }
    
    extractDigits(cpf: string) {
        return cpf.substring(9, 11);
    }
    
    getCleanCpf(cpf: string) {
        return cpf.replace(/\D/g, "");
    }

}