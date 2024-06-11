// @ts-nocheck
export function validate(rawCpf) {
    if (rawCpf === null || rawCpf === undefined) return false;
    const cleanCpf = getCleanCpf(rawCpf);
    if (!isValidLength(cleanCpf)) return false;
    if (doesAllDigitsAreEqual(cleanCpf)) return false;
    const digit1 = calculateDigit(cleanCpf, 10);
    const digit2 = calculateDigit(cleanCpf, 11);
    const validatedDigits = `${digit1}${digit2}`;
    const actualDigits = extractDigits(cleanCpf);
    return actualDigits == validatedDigits;
}

function calculateDigit(cpf: string, factor: number) {
    let sum = 0;
    for (let digit of cpf) {
        if (factor > 1) sum += digit * factor--;
    }
    const rest = sum % 11;
    return (rest < 2) ? 0 : 11 - rest;
}

function isValidLength(cpf: string) {
    return cpf.length === 11;
}

function doesAllDigitsAreEqual(cpf: string) {
    const firstDigit = cpf[0];
    return [...cpf].every(digit => digit === firstDigit);
}

function extractDigits(cpf: string) {
    return cpf.substring(9, 11);
}

function getCleanCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
}