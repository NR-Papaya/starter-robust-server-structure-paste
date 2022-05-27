const pastes = require("../data/pastes-data");
const verifyHasProperty = require("../utils/verifyHasProperty");

//middleware-------------
function exposurePropertyIsValid(req, res, next) {
	const { data: { exposure } = {} } = req.body;
	const validExposure = ["private", "public"];
	if (validExposure.includes(exposure)) {
		return next();
	}
	next({
		status: 400,
		message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
	});
}

function syntaxPropertyIsValid(req, res, next) {
	const { data: { syntax } = {} } = req.body;
	const validSyntax = [
		"None",
		"Javascript",
		"Python",
		"Ruby",
		"Perl",
		"C",
		"Scheme",
	];
	if (validSyntax.includes(syntax)) {
		return next();
	}
	next({
		status: 400,
		message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
	});
}

function expirationIsValidNumber(req, res, next) {
	const { data: { expiration } = {} } = req.body;
	if (expiration <= 0 || !Number.isInteger(expiration)) {
		return next({
			status: 400,
			message: `Expiration requires a valid number`,
		});
	}
	next();
}
// end middleware---------------

function list(req, res) {
	const { userId } = req.params;
	res.json({
		data: pastes.filter(
			userId ? (paste) => paste.user_id == userId : () => true
		),
	});
}

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

function pasteExists(req, res, next) {
	const { pasteId } = req.params;
	const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
	if (foundPaste) {
		res.locals.paste = foundPaste;
		return next();
	}
	next({
		status: 404,
		message: `Paste id not found: ${pasteId}`,
	});
}

function update(req, res) {
	const paste = res.locals.paste;
	const { data: { name, syntax, expiration, exposure, text } = {} } =
		req.body;

	// Update the paste
	paste.name = name;
	paste.syntax = syntax;
	paste.expiration = expiration;
	paste.exposure = exposure;
	paste.text = text;

	res.json({ data: paste });
}

function read(req, res, next) {
	res.json({ data: res.locals.paste });
}

const destroy = (req, res) => {
	const { pasteId } = req.params;
	const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
	// `splice()` returns an array of the deleted elements, even if it is one element
	const deletedPastes = pastes.splice(index, 1);
	res.sendStatus(204);
};

module.exports = {
	list,
	create: [
		verifyHasProperty("name"),
		verifyHasProperty("syntax"),
		verifyHasProperty("exposure"),
		verifyHasProperty("expiration"),
		verifyHasProperty("text"),
		verifyHasProperty("user_id"),
		exposurePropertyIsValid,
		syntaxPropertyIsValid,
		expirationIsValidNumber,
		create,
	],
	read: [pasteExists, read],
	update: [
		pasteExists,
		verifyHasProperty("name"),
		verifyHasProperty("syntax"),
		verifyHasProperty("exposure"),
		verifyHasProperty("expiration"),
		verifyHasProperty("text"),
		exposurePropertyIsValid,
		syntaxPropertyIsValid,
		expirationIsValidNumber,
		update,
	],
	destroy: [pasteExists, destroy],
};
