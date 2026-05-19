var express = require("express");
const { userQueries } = require("../db");
const { postUsersCreate } = require("./utils");
var router = express.Router();

/* GET users listing. */
router.get("/", async (req, res, _next) => {
  const users = userQueries.getAllUsersSanitized();
  res.send(users);
});

router.post("/create", async (req, res, _next) => {
  const { username, password } = req?.body ?? {};

  const { status, data } = await postUsersCreate({ username, password });

  res.status(status).send(data);
});

module.exports = router;
