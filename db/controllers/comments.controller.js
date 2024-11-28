const { request } = require("../app");
const { getCommentsByArticleId, postComment } = require("../models/comments.model")

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    getCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err)
    })
};

exports.postComment = (req, res, next) => {
    const newComment = req.body
    const { article_id } = req.params
    postComment(newComment, article_id)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  };
