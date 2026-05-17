const express = require("express");
const { tagsQueries } = require("../db");

const router = express.Router();

router.get("/search", async (req, res, _next) => {
  const { q: query = "" } = req.query ?? {};

  if (query) {
    const tags = tagsQueries
      .searchTags(query)
      ?.map((tag) => ({ name: tag?.name, namespace: tag?.namespace }));

    res.send(tags);
  } else {
    res.status(400).send("Please provide a query");
  }
});

module.exports = router;
