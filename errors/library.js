//preciso fazer uma classe para error da api
//preciso q ela receba messagem e status
//preciso chamar a classe erro
const ApiError = (message, status) => {
    const erro = new Error(message);
    erro.statusCode = status;
    return erro;
};

module.exports = { ApiError };
