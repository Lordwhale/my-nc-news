const { request } = require("../../app");
const { getAllUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((allUsers) => {
      res.status(200).send({ allUsers });
    })
    .catch((err) => {
      next(err);
    });
};
