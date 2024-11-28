const { request } = require("../../app");
const {
  selectArticleById,
  selectArticle,
  updatedVotes
} = require("../models/articles.model");

exports.getArticles = (req, res) => {
  selectArticle().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVote = (req, res, next) => {
  const { article_id } = req.params;
  const updatedBody = req.body.inc_votes;
  updatedVotes(updatedBody, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });

}