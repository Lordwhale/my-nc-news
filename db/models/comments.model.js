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

exports.postComment = (newComment, article_id) => {
  const { username, body } = newComment;
  if (!username && !body) {
    return Promise.reject({ status: 400, msg: "missing input" });
  }
  if (!username ) {
    return Promise.reject({ status: 400, msg: "missing username" });
  }
  if (!body) {
    return Promise.reject({ status: 400, msg: "missing content" });
  }
  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comments) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comments])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return rows[0];
      }
    });
};

exports.checkCommentById = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return rows[0];
    });
};
