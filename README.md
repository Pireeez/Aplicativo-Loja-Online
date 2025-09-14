# Aplicativo de Pedidos

## Introdução
Este é um sistema completo de pedidos, desenvolvido com **Node.js**, **SQL** e **JavaScript**, com comunicação entre **Front-End** e **Back-End**.  
O aplicativo possui duas frentes:

1. **Backoffice (Admin)** – para gerenciar categorias, produtos e visualizar pedidos.
2. **Loja (Usuário Final)** – para o cliente navegar pelos produtos, adicionar itens ao carrinho e finalizar pedidos.

O sistema é responsivo, funcionando tanto em **desktop** quanto em **mobile**, garantindo uma boa experiência para usuários e administradores.

---

## Protótipos
- **Backoffice (Admin):** [Figma - Backoffice](https://www.figma.com/proto/Iau1yAKzWNLZUdv8UJmstz/Prot%C3%B3tipo-Desafio-Final-NodeJs?node-id=81-757&t=fdfQ8ffyJWLyaJHS-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=81%3A757&show-proto-sidebar=1)
- **Loja Desktop:** [Figma - Loja Desktop](https://www.figma.com/proto/Iau1yAKzWNLZUdv8UJmstz/Prot%C3%B3tipo-Desafio-Final-NodeJs?node-id=109-3674&t=t87k6mKbxVeBODV8-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=109%3A3674&show-proto-sidebar=1)
- **Loja Mobile:** [Figma - Loja Mobile](https://www.figma.com/proto/Iau1yAKzWNLZUdv8UJmstz/Prot%C3%B3tipo-Desafio-Final-NodeJs?node-id=114-338&t=t87k6mKbxVeBODV8-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=114%3A338&show-proto-sidebar=1)

---

## Funcionalidades

### **1. Backoffice (Admin)**
- **Categorias**
  - Criar e atualizar categorias via modal.
  - Não permitir duplicidade de nome.
  - Não permitir categorias sem nome.
  - Ativar ou desativar visualização (não excluir).

- **Produtos**
  - Criar e atualizar produtos via modal.
  - Campos obrigatórios: nome, preço, estoque, categoria.
  - Regras:
    - Nome único.
    - Preço e estoque não podem ser negativos.
    - Estoque total por categoria ≤ 100.
    - Preço com máscara monetária "R$".

- **Pedidos**
  - Listagem de pedidos realizados pelos usuários da loja.
  - Filtros por data e valor total.
  - Modal para visualizar itens de cada pedido.

---

### **2. Loja (Usuário Final)**
- Navegar pelos produtos por categoria.
- Buscar produtos pelo nome.
- Adicionar produtos ao **carrinho**:
  - Não adicionar produtos sem estoque.
  - Não permitir quantidade maior que o estoque.
- **Carrinho de compras**
  - Botão flutuante (FAB) visível em qualquer posição da tela.
  - Alterar quantidade, remover itens, visualizar total.
  - Finalizar pedido → salva no banco e limpa o carrinho.
  - Itens do carrinho persistem ao fechar e abrir a tela.

---

## Regras de Negócio

- **Categorias**
  - Nome único, obrigatório.
- **Produtos**
  - Nome obrigatório e único.
  - Categoria obrigatória.
  - Preço e estoque obrigatórios e ≥ 0.
  - Estoque total por categoria ≤ 100.
  - Preço exibido como "R$".
- **Pedidos**
  - Itens não podem ultrapassar estoque disponível.
  - Registro de pedidos persistente no banco.

---

## Tecnologias Utilizadas
- **Back-End:** Node.js, Express
- **Banco de Dados:** SQL (SQLite, MySQL ou PostgreSQL)
- **Front-End:** HTML, CSS, JavaScript (ou frameworks modernos)
- **Comunicação:** Axios ou Fetch API
- **Outros:** Multer (opcional, para upload de imagens)

---

## Estrutura do Banco de Dados
- **Produtos**
  - `id` (PK)
  - `nome`
  - `categoria_id` (FK)
  - `preco` (REAL)
  - `estoque` (INTEGER)
  - `imagem` (opcional)
- **Categorias**
  - `id` (PK)
  - `nome`
  - `ativo` (BOOLEAN)
- **Pedidos**
  - `id` (PK)
  - `data` (DATE)
  - `valor_total` (REAL)
- **Itens_Pedido**
  - `id` (PK)
  - `pedido_id` (FK)
  - `produto_id` (FK)
  - `quantidade`
  - `preco_unitario`

---

## Como Rodar o Projeto
1. Clonar o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
