const config = require("./config.js");
const crypto = require("crypto");

const signingSecret = config.obj["slack-signing-secret"];

module.exports = {
	makeError: (message) => {
	       	return JSON.stringify({ "Error": message });
	},
	authorise: (req) => {
		var signature = req.headers['x-slack-signature'];
		var timestamp = req.headers['x-slack-request-timestamp'];
		var version = "v0";

		if (signature === undefined || timestamp === undefined)
			return false;

		var finalString = version + ":" + timestamp.toString() + ":" + req.rawBody;

		var calcSig = crypto.createHmac('sha256', signingSecret)
                   .update(finalString)
                   .digest('hex');
		calcSig = version + "=" + calcSig;

		return calcSig === signature;
	}
}

