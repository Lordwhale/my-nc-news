const endpointsJson = require("../../endpoints.json");
const { request } = require("../app");
const { selectTopics } = require("../models/model")

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
    selectTopics().then((rows) => {
      res.status(200).send({ topics: rows });
  })
};
