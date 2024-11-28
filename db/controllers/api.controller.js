const endpointsJson = require("../../endpoints.json");
const { request } = require("../../app");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};




