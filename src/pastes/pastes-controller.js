const pastes = require("../data/pastes-data");

const list = (req, res, next) => {
	res.json({ data: pastes });
};

const create = (req, res, next) => {
	let lastPasteId = pastes.reduce(
		(maxId, paste) => Math.max(maxId, paste.id),
		0
	);
	const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
		req.body;

	const newPaste = {
		id: ++lastPasteId, // Increment last ID, then assign as the current ID
		name,
		syntax,
		exposure,
		expiration,
		text,
		user_id,
	};
	pastes.push(newPaste);
	res.status(201).json({ data: newPaste });
};

const read = (req, res, next) => {
	const { pasteId } = req.params;
	const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

	if (foundPaste) {
		res.json({ data: foundPaste });
	} else {
		next({ status: 404, message: `Paste id not found: ${pasteId}` });
	}
}

// const destroy =

module.exports = {
	list,
	create,
	read,
	// destroy
};
