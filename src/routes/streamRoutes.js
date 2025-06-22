const express = require("express");
const router = express.Router();
const { streamMovie } = require("../controllers/streamController");

router.get("/movie", streamMovie);

module.exports = router;
