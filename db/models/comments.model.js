const db = require("../connection");

exports.getCommentsByArticleId = (article_id) => {
  const text = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  return db.query(text, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "item not found" });
    }
    return rows;
  });
};
