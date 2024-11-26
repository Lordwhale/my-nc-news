const { selectTopics } = require("../models/topics.model")

exports.getTopics = (req, res) => {
    selectTopics().then((rows) => {
      res.status(200).send({ topics: rows });
  })
};