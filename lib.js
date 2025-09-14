const formataNome = (categoria) => {
    return categoria
        .toLowerCase()
        .normalize("NFD") // separa acentos
        .replace(/[\u0300-\u036f]/g, ""); // remove acentos
};

module.exports = { formataNome };
