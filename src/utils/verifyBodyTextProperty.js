module.exports = function bodyHasTextProperty(req, res, next) {
	const { data: { text } = {} } = req.body;
	if (text) {
		return next(); // Call `next()` without an error message if the result exists
	}
	next({
		status: 400,
		message: "A 'text' property is required.",
	});
}