module.exports = {
        handle: (payload) => {
		var retObj = { status: 400, content: JSON.stringify({"Error": "challenge value not found"})};
		if (payload["challenge"])
			retObj = { status: 200, content: JSON.stringify({"challenge": payload["challenge"]})};
                return retObj
        }
}
