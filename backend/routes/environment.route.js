const router = require("express").Router();

const controller = require("../controllers/environment.controller");

router.get("/", controller.getEnvironments);

router.post("/", controller.createEnvironment);

router.put("/:id", controller.updateEnvironment);

router.delete("/:id", controller.deleteEnvironment);

module.exports = router;