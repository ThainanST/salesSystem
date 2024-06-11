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

(Detalhes serão fornecidos posteriormente)
