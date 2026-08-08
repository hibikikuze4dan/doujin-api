import { Router } from "express";
import { tagsQueries } from "../db";

const router = Router();

router.get("/search", async (req, res, _next) => {
  const { q: query = "" } = req.query ?? {};

  const tagQuery = typeof query === "string" ? query : "";

  if (tagQuery) {
    const tags = tagsQueries
      .getTags("name", tagQuery)
      ?.map((tag) => ({ name: tag?.name, namespace: tag?.category_id }));

    res.send(tags);
  } else {
    res.status(400).send("Please provide a valid query");
  }
});

export default router;
