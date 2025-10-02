const ApiError = (message, status) => {
    const erro = new Error(message);
    erro.statusCode = status;
    return erro;
};

module.exports = { ApiError };
