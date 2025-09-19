CREATE TABLE Categorias(
id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL UNIQUE,
status BOOLEAN
);

DROP TABLE Categorias;
DROP TABLE Produtos


CREATE TABLE Produtos (
id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
id_categoria INTEGER NOT NULL,
nome TEXT NOT NULL UNIQUE,
descricao TEXT,
preco REAL NOT NULL,
estoque INTEGER NOT NULL,
status BOOLEAN,
imagem TEXT,
FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria)
);

-- SELECT 
-- p.id_produto, 
-- p.nome, 
-- p.descricao, 
-- c.nome, 
-- p.estoque, 
-- p.status, 
-- p.imagem 
-- FROM Produtos p
-- JOIN Categorias c ON c.id_categoria = p.id_categoria  


CREATE TRIGGER validar_estoque
BEFORE INSERT ON Produtos
FOR EACH ROW
        WHEN NEW.estoque > 100 
BEGIN
        SELECT RAISE(ABORT, 'Estoque máximo permitido é 100!');
END;


INSERT INTO Produtos (nome, descricao, id_categoria, preco, estoque, status, imagem)
VALUES ('Geladeira Brastemp', 'A Geladeira',1,6359.00,101,0,null)


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