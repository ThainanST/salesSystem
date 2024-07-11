import axios from "axios";
import { handleCommand } from '../src/cli';

// Override axios to treat all HTTP responses as successful regardless of status code.
axios.defaults.validateStatus = function () {
    return true;    
};

test("Deve inserir cpf", async function () {
    const command = "set-cpf 987.654.321-00";
    const output: any = await handleCommand(command);
    expect(output.cpf).toBe("987.654.321-00");
});

test("Deve inserir item", async function () {
    let command = "add-item 1 1";
    let output: any = await handleCommand(command);
    command = "add-item 2 1";
    output = await handleCommand(command);
    expect(output.items[0].id_product).toBe("1");
    expect(output.items[0].quantity).toBe("1");
    expect(output.items[1].id_product).toBe("2");
    expect(output.items[1].quantity).toBe("1");
});

test("Não deve criar pedido com cpf inválido", async function () {
    let output: any = await handleCommand("set-cpf 144.796.170-63");
    output = await handleCommand("checkout");
    expect(output.message).toBe("Invalid cpf");
    output = await handleCommand("clear-input");
});

test("Deve fazer pedido com 3 produtos", async function () {
    let output: any = await handleCommand("set-cpf 987.654.321-00");
    output = await handleCommand("add-item 1 1");
    output = await handleCommand("add-item 2 1");
    output = await handleCommand("add-item 3 3");
    output = await handleCommand("checkout");
    expect(output.total).toEqual(6350);
    output = await handleCommand("clear-input");
});

test("Nao deve fazer pedido com produto inexistente", async function () {
    let output: any = await handleCommand("set-cpf 987.654.321-00");
    output = await handleCommand("add-item 1 1");
    output = await handleCommand("add-item 99 1");
    output = await handleCommand("add-item 3 3");
    output = await handleCommand("checkout");
    expect(output.message).toEqual("Product not found"); 
});