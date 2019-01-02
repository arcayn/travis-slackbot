const challengeHandler = require('./handlers/challengeHandler.js');

module.exports = {
	handle: (payload) => {
		var retObj = {
			"status": 400,
			"content": JSON.stringify({"Error": "invalid type given"})
		};
		if (payload["type"] == "url_verification") {
			iObj = challengeHandler.handle(payload);
			retObj['status'] = iObj['status'];
			retObj['content'] = iObj['content'];
		}
		return retObj
	}
}

