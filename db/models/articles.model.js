const db = require("../connection");

exports.selectArticle = () => {
  return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
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
