const sql = {
    //Produto
    sumEstoqueProduto: `SELECT SUM(estoque) AS totalEstoque FROM Produtos WHERE id_categoria = ?`,
    existeNomeProduto: `SELECT COUNT(*) AS existeNome FROM Produtos WHERE nome = ?`,
    insertProdutos: `INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    filtraAllProdutos: `SELECT p.id_produto, p.nome, p.descricao, c.nome AS categoria, p.preco, p.estoque, p.status, p.imagem FROM Produtos p JOIN Categorias c ON c.id_categoria = p.id_categoria `,
    updateProduto: (arg) => `UPDATE Produtos SET ${arg} WHERE id_produto = ?`,

    //Categoria
    nomeExisteCategoria: `SELECT COUNT(*)AS nome FROM Categorias WHERE nome = ?`,
    insertCategoria: `INSERT INTO Categorias (nome, status) VALUES (?,?)`,
    filtraAllCategoria: 'SELECT id_categoria, nome, status FROM Categorias',
    statusCategoria: 'SELECT status FROM Categorias WHERE id_categoria = ?',
    updateCategoria: (arg) => `UPDATE Categorias SET ${arg} WHERE id_categoria = ?`,

    //Pedidos
};

module.exports = sql;
