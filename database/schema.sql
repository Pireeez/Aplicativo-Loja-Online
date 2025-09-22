-- CREATE TABLE Categorias(
-- id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
-- nome TEXT NOT NULL UNIQUE,
-- status BOOLEAN
-- );

-- DROP TABLE Categorias;
-- DROP TABLE Produtos


-- CREATE TABLE Produtos (
-- id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
-- id_categoria INTEGER NOT NULL,
-- nome TEXT NOT NULL UNIQUE,
-- descricao TEXT,
-- preco REAL NOT NULL,
-- estoque INTEGER NOT NULL,
-- status BOOLEAN,
-- imagem TEXT,
-- FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria)
-- );

-- DROP TABLE Pedidos;
-- DROP TABLE Itens_Pedidos;
-- DROP TABLE Carrinho;

CREATE TABLE Itens_Pedidos (
  id_item INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario REAL NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES Pedidos (id_pedido),
  FOREIGN KEY (id_produto) REFERENCES Produtos (id_produto)
);

CREATE TABLE Carrinho (
  id_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario REAL NOT NULL,
  data_adicao DATE DEFAULT (DATETIME('now')),
  FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto)
);

CREATE TABLE Pedidos (
  id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  data DATE NOT NULL,
  valor_total REAL NOT NULL
);

DROP TABLE Pedidos

SELECT * FROM Itens_Pedidos 


SELECT
  p.id_pedido,
  p.data,
  SUM(i.quantidade) AS qtd_itens,
  SUM(i.valor_unitario * i.quantidade) AS valor_total
FROM Pedidos p
LEFT JOIN Itens_Pedidos i ON i.id_pedido = p.id_pedido
GROUP BY p.id_pedido

WITH valorTotal AS 
(
    SELECT
      i.id_pedido,
      pd.nome, 
      SUM(i.quantidade) AS quantidade_total,
      i.valor_unitario,
      SUM(i.valor_unitario * i.quantidade) AS valor_total
    FROM Itens_Pedidos i
    JOIN Produtos pd ON pd.id_produto = i.id_produto 
    GROUP BY i.id_pedido, pd.nome, i.valor_unitario
)
SELECT
  p.id_pedido,
  pd.nome,
  p.data,
  vt.quantidade_total AS quantidade,
  vt.valor_unitario AS preco_unitario,
  vt.valor_total AS subtotal
FROM Pedidos p
JOIN valorTotal vt ON vt.id_pedido = p.id_pedido
JOIN Produtos pd ON pd.nome = vt.nome
WHERE p.id_pedido = ?
ORDER BY vt.valor_total DESC;












