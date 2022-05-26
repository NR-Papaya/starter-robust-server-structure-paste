const router = require("express").Router();
const controller = require("./pastes-controller");
const verifyBodyTextProperty = require("../utils/verifyBodyTextProperty")

router.route("/")
    .get(controller.list)
    .post(verifyBodyTextProperty, controller.create)
router.route("/:pasteId")
    .get(controller.read)

module.exports = router;