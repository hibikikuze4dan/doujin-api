import { Router } from "express";

var router = Router();

/* GET home page. */
router.get("/", function (req, res, _next) {
  res.render("index", { title: "Express" });
});

router.get("/health", function (req, res, _next) {
  res.json("Working as intended");
});

export default router;
