/** @format */

const admin = require("../controllers/admin.server.controllers");

module.exports = function (app) {
  app.route("/convert").get(admin.convert);
};
