CREATE TABLE Categorias(
id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
nome_normalizado TEXT NOT NULL UNIQUE,
status BOOLEAN
);

DROP TABLE Categorias;

-- CREATE TABLE Produtos (
-- id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
-- id_categoria INTEGER,
-- nome TEXT NOT NULL,
-- descricao TEXT,
-- preco REAL NOT NULL,
-- estoque INTEGER,
-- status BOOLEAN,
-- FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria) 
-- );

-- CREATE TABLE Pedidos (
-- id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
-- id_itens INTEGER NOT NULL,
-- quantidade INTEGER NOT NULL,
-- valor REAL,
-- FOREIGN KEY (id_itens) REFERENCES Itens_Pedidos (id_itens) 
-- );

-- CREATE TABLE Itens_Pedidos (
-- id_itens INTEGER PRIMARY KEY AUTOINCREMENT,
-- id_pedido INTEGER NOT NULL,
-- id_produto INTEGER NOT NULL,
-- quantidade INTEGER NOT NULL,
-- FOREIGN KEY (id_pedido) REFERENCES Pedidos (id_pedido),
-- FOREIGN KEY (id_produto) REFERENCES Produtos (id_produto)
-- );