const router = require("express").Router();

const {
    executeRequest,
} = require("../controllers/request.controller");

router.post("/", executeRequest);

module.exports = router;