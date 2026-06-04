import { Router } from "express";
import { tagsQueries } from "../db";

const router = Router();

router.get("/search", async (req, res, _next) => {
  const { q: query = "" } = req.query ?? {};

  const tagQuery = typeof query === "string" ? query : "";

  if (tagQuery) {
    const tags = tagsQueries
      .searchTags(tagQuery)
      ?.map((tag) => ({ name: tag?.name, namespace: tag?.namespace }));

    res.send(tags);
  } else {
    res.status(400).send("Please provide a valid query");
  }
});

export default router;
