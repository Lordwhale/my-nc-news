const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/api.controller");

app.use(express.json())

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.all('*', (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});


module.exports = app;