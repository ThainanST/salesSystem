## Cenário

Este projeto consiste na implementação de um sistema de vendas online, permitindo a realização de pedidos com múltiplos itens, cada um com uma quantidade variável. O sistema deve calcular o frete, os impostos, aplicar cupons de desconto e interagir com o estoque. Além disso, serão implementados fluxos de pagamento e cancelamento de pedidos.

Para iniciar, o projeto será estruturado de forma simples. A implementação inicial será refatorada posteriormente.

## Parte 1

### Testes

1. Criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total.
2. Criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido).
3. Não permitir a criação de um pedido com CPF inválido (lançar um erro apropriado).

### Considerações

Utilizar e refatorar o algoritmo de validação de CPF disponível em: [Validação de CPF](https://github.com/rodrigobranas/cccat7_refactoring/blob/master/src/example2/cpfBefore.ts).

### Sugestões

- Faça a modelagem da forma que preferir. A implementação será aprimorada em aulas futuras com influências de DDD e Clean Architecture.
- Utilize a linguagem e biblioteca de teste de sua preferência.
- Devem existir, no mínimo, dois arquivos: um para testes e outro para a aplicação.
- Como mecanismo de persistência, pode ser utilizado um banco de dados, um array em memória, um arquivo ou qualquer outro meio adequado.
- Para entrada de dados, pode ser utilizada uma API HTTP, uma CLI ou qualquer outro mecanismo adequado.
- Siga a disciplina de desenvolvimento orientado a testes: crie primeiro um teste que falha, depois faça o teste passar e, em seguida, refatore o código.

## Parte 2

### Requisitos

1. Não deve aplicar cupom de desconto expirado
2. Ao fazer um pedido, a quantidade de um item não pode ser negativa
3. Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez
4. Nenhuma dimensão do item pode ser negativa
5. peso do item não pode ser negativo
6. Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)
7. Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado

### Considere para o cálculo do frete

1. 0 valor mínimo é de R$10,00
2. Utilize a fórmula abaixo para calcular o valor do frete

### Considerações

1. Por enquanto, como não temos uma forma de calcular a distância entre o CEP de origem e destino, de 1000 km (fixo)
2. Fórmula de Cálculo do Frete

Valor do Frete = distância (km) * volume (m3) * (densidade/100)

#### Exemplos de volume ocupado (cubagem)
Camera: 20cm x 15 cm x 10 cm = o,003 m3
Guitarra: l00cm x 30cm x 10cm = 0,03 m3
Geladeira: 200cm x 100cm x 50m = 1 m3

#### Exemplos de densidade
camera: 1kg / 0,003 m3 = 333kg/m3
Guitarra: 3kg / 0,03 m3 = 100kg/m3
Geladeira: 40kg / 1 m3 = 40kg/m3

#### Exemplos
produto: Camera
distância: 1000 (fixo)
volume: 0,003
densidade: 333
preço: R$9,90 (1000 * 0,003 * (333/100))
preço mínimo: R$10,00

produto: Guitarra
distância: 1000 (fixo)
volume: 0,03
densidade: 100
preço: R$30,00 (1000 * 0,03 * (100/100))

produto: Geladeira
distância: 1000 (fixo)
volume: 1
densidade: 40
preço: R$400,00 (1000 * 1 * (40/100))


## Parte 3

### Testes

1. Deve gerar o código do pedido
2. Fazer um pedido (caso de uso)
3. Deve simular o frete (caso de uso)
4. Deve validar o Cupom de desconto (caso de uso)

### Considere
- O código do pedido é formado por AAAAPPPPPPPP onde AAAA representa o ano e o PPPPPPPP representa um sequencial do pedido

### Importante
- Implemente os DTOs para cada um dos use cases
- Utilize o banco de dados para obter e persistir os dados