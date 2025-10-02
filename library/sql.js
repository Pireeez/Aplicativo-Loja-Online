const sql = {
    //Produto
    sumEstoqueProduto: `SELECT SUM(estoque) AS totalEstoque FROM Produtos WHERE id_categoria = ?`,
    estoqueProdutoUpdate: `SELECT id_produto ,nome ,estoque AS totalEstoque FROM Produtos WHERE id_categoria = ?`,
    existeNomeProduto: `SELECT COUNT(*) AS existeNome FROM Produtos WHERE nome = ?`,
    insertProdutos: `INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    filtraAllProdutos: `SELECT p.id_produto, p.nome, p.descricao, c.nome AS categoria, c.status AS statusCategoria, p.preco, p.estoque, p.status, p.imagem FROM Produtos p JOIN Categorias c ON c.id_categoria = p.id_categoria`,
    updateProduto: (arg) => `UPDATE Produtos SET ${arg} WHERE id_produto = ?`,
    filtraProdutoNomeDescricao: ` SELECT
            p.id_produto,
            p.nome,
            p.descricao,
            c.nome AS categoria,
            c.status AS statusCategoria,
            p.preco, p.estoque,
            p.status,
            p.imagem
            FROM Produtos p
            JOIN Categorias c ON c.id_categoria = p.id_categoria
            WHERE LOWER(p.nome) LIKE LOWER(?) OR LOWER(p.descricao) LIKE LOWER(?)`,

    //Categoria
    nomeExisteCategoria: `SELECT nome FROM Categorias`,
    insertCategoria: `INSERT INTO Categorias (nome, status) VALUES (?,?)`,
    filtraAllCategoria: 'SELECT id_categoria, nome, status FROM Categorias',
    statusCategoria: 'SELECT status FROM Categorias WHERE id_categoria = ?',
    updateCategoria: (arg) => `UPDATE Categorias SET ${arg} WHERE id_categoria = ?`,

    //Carrinho
    existeProdutoCarrinho: `SELECT COUNT(*) AS existeProduto FROM Carrinho WHERE id_produto = ?`,
    qtdEstoqueProduto: `SELECT estoque AS estoqueProduto FROM Produtos WHERE id_produto = ?`,
    upsertCarrinho: `
                    INSERT INTO Carrinho (id_produto, quantidade, valor_unitario)
                    VALUES (?, ?, ?)
                    ON CONFLICT (id_produto)
                    DO UPDATE SET quantidade = excluded.quantidade, valor_unitario = excluded.valor_unitario
                `,
    dadosProdutoCarrinho: `
                    SELECT p.id_produto, p.nome, p.descricao, c.quantidade, p.estoque, SUM(p.preco * c.quantidade) AS totalProduto, p.imagem, c.data_adicao
                    FROM Carrinho c
                    JOIN Produtos p ON p.id_produto = c.id_produto
                    GROUP BY p.id_produto
                    `,
    dataUpdateQuantidadeCarrinho: `UPDATE Carrinho SET quantidade = ? WHERE id_produto = ?`,
    deleteProdutoCarrinho: `DELETE FROM Carrinho WHERE id_produto = ?`,

    //Pedido
    itensCarrinho: `SELECT c.id_produto, c.quantidade, c.valor_unitario FROM Carrinho c`,
    insertPedidos: `INSERT INTO Pedidos (data, valor_total) VALUES (DATETIME('now'), ?)`,
    insertItensPedidos: `INSERT INTO Itens_Pedidos (id_pedido, id_produto, quantidade, valor_unitario) VALUES (?, ?, ?, ?)`,
    subtraiEstoqueExistente: `UPDATE Produtos SET estoque = estoque - ? WHERE id_produto = ?`,
    limpaCarrinho: `DELETE FROM Carrinho`,
    infoPedidos: `SELECT p.id_pedido, p.data, SUM(i.quantidade) AS totalItens, SUM(i.valor_unitario * i.quantidade) AS valorTotal 
                    FROM Pedidos p LEFT JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
                    GROUP BY p.id_pedido`,
    detailsPedidos: `
            SELECT 
                pd.nome,
                p.data,
                SUM(i.quantidade) AS quantidade,
                i.valor_unitario AS preco_unitario,
                SUM(i.quantidade * i.valor_unitario) AS subtotal
            FROM Pedidos p
            JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
            JOIN Produtos pd ON pd.id_produto = i.id_produto
            WHERE p.id_pedido = ?
            GROUP BY pd.nome, p.data, i.valor_unitario
            ORDER BY subtotal DESC;
        `,

    filtroPedidoDataValor: (data, value) => `SELECT
                p.id_pedido,
                p.data,
                SUM(i.quantidade) AS totalItens,
                SUM(i.valor_unitario * i.quantidade) AS valorTotal
                FROM Pedidos p
                LEFT JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
                ${data}
                GROUP BY p.id_pedido
                ${value} `,
};

module.exports = sql;
