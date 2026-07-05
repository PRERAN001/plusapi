const router = require("express").Router();

const controller = require("../controllers/collection.controller");

router.get("/", controller.getCollections);

router.post("/", controller.createCollection);

router.put("/:id", controller.updateCollection);

router.delete("/:id", controller.deleteCollection);

module.exports = router;