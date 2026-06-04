import { Router } from "express";
import { archivesQueries, historyQueries } from "../../db";

const router = Router();

router.get("/all", async (req, res, _next) => {
  const { withdata = "false" } = req?.query ?? {};

  const isQueryString = typeof withdata === "string";

  if (!isQueryString) {
    res.status(400).send("Please provide valid query");
    return;
  }

  const shouldGetData = withdata?.toLocaleLowerCase?.() === "true";

  let history = historyQueries.getAllHistory();

  history = shouldGetData
    ? history.map((his) => {
        return {
          ...his,
          archive: archivesQueries.getArchiveById(his?.archive_id),
        };
      })
    : history;

  res.json(history);
});

router.delete("/", async (req, res, _next) => {
  const { changes } = historyQueries.removeAllHistory();

  res.json({
    status: "success",
    message: `Successfully deleted ${changes} history entries!`,
    data: [],
  });
});

export default router;
