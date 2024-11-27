const { request } = require("../app");
const { getCommentsByArticleId } = require("../models/comments.model")

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    getCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err)
    })
}
