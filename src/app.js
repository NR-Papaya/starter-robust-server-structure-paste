const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
// TODO: Follow instructions in the checkpoint to implement ths API.
app.get("/pastes", (req, res, next) => {
	res.json({ data: pastes });
});

app.get("/pastes/:pasteId", (req, res, next) => {
	const { pasteId } = req.params;
	const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

	if (foundPaste) {
		res.json({ data: foundPaste });
	} else {
		next(`Paste id not found: ${pasteId}`);
	}
});
// Not found handler
app.use((request, response, next) => {
	next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
	console.error(error);
	response.send(error);
});

module.exports = app;
