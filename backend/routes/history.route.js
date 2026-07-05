const router = require("express").Router();

const {

    getHistory,

    deleteHistory,

    clearHistory,

} = require("../controllers/history.controller");

router.get("/", getHistory);

router.delete("/:id", deleteHistory);

router.delete("/", clearHistory);

module.exports = router;