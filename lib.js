const normalizar = (str) => {
    return str
        .normalize('NFD') // separa acentos das letras
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-zA-Z0-9\s]/g, '') // remove caracteres especiais, mantendo letras, números e espaços
        .trim(); // remove espaços extras no início e no fim
};

module.exports = { normalizar };
