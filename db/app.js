const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleComments } = require("./controllers/comments.controller");

const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controller");

const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/errors");

app.get("/api", getApi); // list all avail APIs

app.get("/api/topics", getTopics); // get all topics

app.get("/api/articles", getArticles); // get all articles, desc order, body removed

app.get("/api/articles/:article_id", getArticleById); // get article by id

app.get("/api/articles/:article_id/comments", getArticleComments); // get all comments for given article, newest first

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
