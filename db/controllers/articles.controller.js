const { request } = require("../app");
const {
  selectArticleById,
  selectArticle,
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
