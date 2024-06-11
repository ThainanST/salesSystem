import { validate } from "../src/main";

const validCpfs = [
    "987.654.321-00",
    "714.602.380-01",
    "313.030.210-72",
    "144.796.170-60",
];

test.each(validCpfs)("Deve testar cpfs válidos: %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeTruthy();
});

const invalidCpfs = [
    "111.111.111-11",
    "222.222.222-22",
    "333.333.333-33",
    "444.444.444-44",
    "555.555.555-55",
    "666.666.666-66",
    "777.777.777-77",
    "888.888.888-88",
    "999.999.999-99",
];

test.each(invalidCpfs)("Deve testar cpfs inválidos: %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeFalsy();
});

test("Deve testar cpf com menos de 11 caracteres", function () {    
    const isValid = validate("123");
    expect(isValid).toBeFalsy();
});

test("Deve testar cpf com mais de 14 caracteres", function () {    
    const isValid = validate("123456789012345");
    expect(isValid).toBeFalsy();
});

test("Deve testar cpf undefined", function () {   
    const isValid = validate(undefined);
    expect(isValid).toBeFalsy();
});

test("Deve testar cpf null", function () {    
    const isValid = validate(null);
    expect(isValid).toBeFalsy();
});