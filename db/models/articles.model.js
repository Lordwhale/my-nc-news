const db = require("../connection");

exports.selectArticle = () => {
  return db.query("SELECT article_id, title,topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC")
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (article_id) => {
  const text = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(text, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "item not found" });
    }
    return rows[0];
  });
};
