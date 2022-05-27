const router = require("express").Router({ mergeParams: true });
const controller = require("./pastes-controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);
router
	.route("/:pasteId")
	.get(controller.read)
	.delete(controller.destroy)
	.put(controller.update)
	.all(methodNotAllowed);

module.exports = router;
