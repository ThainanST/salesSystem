import axios from "axios";

// Override axios to treat all HTTP responses as successful regardless of status code.
axios.defaults.validateStatus = function () {
    return true;    
};

test("Não deve criar pedido com cpf inválido", async function () {
    const input = {
        cpf: "144.796.170-63"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Invalid cpf");
});

test("Deve fazer pedido com 3 produtos", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toEqual(6350);
});

test("Deve fazer pedido com produto inexistente", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 4, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Product not found");
});

test("Deve fazer pedido com 3 produtos e aplicar cupom de desconto", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toEqual(5132);
});

test("Não deve aplicar cupom de desconto inválido", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ],
        coupon: "INVALIDO"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Coupon not found");
});

test("Não deve aplicar cupom de desconto expirado", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ],
        coupon: "VALE20_EXPIRED"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toEqual(6350);
    expect(output.message).toBe("Coupon expired");
});

test("Não deve fazer pedido com quantidade negativa", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: -1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Quantity must be positive");
});

test("Não deve fazer pedido item duplicado", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 1, quantity: 1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Duplicate products");
});

test("Deve fazer pedido e calcular o frete", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toEqual(30);
    expect(output.total).toEqual(1030);
});

test("Deve fazer pedido e calcular o frete com valor minimo", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 3, quantity: 1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toEqual(10);
    expect(output.total).toEqual(40);
});