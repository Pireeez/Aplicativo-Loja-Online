const { db } = require('../database/database');

function auxQuery(metodo, sql, params) {
    return new Promise((resolve, reject) => {
        db[metodo](sql, params, function (err, res) {
            // <--- function normal
            if (err) {
                console.error('Erro ao executar a query', err);
                reject(err);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes,
                    res: res,
                });
            }
        });
    });
}

const runQuery = (sql, params) => {
    return auxQuery('run', sql, params)
        .then((result) => result)
        .catch((err) => err);
};

function getQuery(sql, params) {
    return auxQuery('get', sql, params).then((result) => result.res);
}

function allQuery(sql, params) {
    return auxQuery('all', sql, params).then((result) => result.res);
}

module.exports = { runQuery, getQuery, allQuery };
