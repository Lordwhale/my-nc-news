const db = require("../connection");

exports.selectTopics = (res, req) => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows;
    })
};
