const express = require("express");
const cors = require("cors");
const app = express();
const { getApi } = require("./db/controllers/api.controller");
const { getUsers } = require("./db/controllers/users.controller");
const { getTopics } = require("./db/controllers/topics.controller");
const {
  getArticleComments,
  postComment,
  deleteComment
} = require("./db/controllers/comments.controller");

const {
  getArticles,
  getArticleById,
  updateVote
} = require("./db/controllers/articles.controller");

const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./db/errors/errors");

app.use(cors());

app.use(express.json());

app.get("/api", getApi); // list all avail APIs

app.get("/api/topics", getTopics); // get all topics

app.get("/api/users", getUsers); // get all users

app.get("/api/articles", getArticles); // get all articles, desc order, body removed

app.get("/api/articles/:article_id", getArticleById); // get article by 

app.patch("/api/articles/:article_id", updateVote); // add new value to votes

app.get("/api/articles/:article_id/comments", getArticleComments); // get all comments for given article, newest first

app.post("/api/articles/:article_id/comments", postComment); // post a comment for an article

app.delete("/api/comments/:comment_id", deleteComment); // delete a comment by id


app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
