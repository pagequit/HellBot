const crypto = require('crypto');

function TokenGen() {
	this.crypto = crypto;
}

TokenGen.prototype = {
	getToken() {
		return this.crypto.randomBytes(16).toString('hex');
	}
}

module.exports = TokenGen;
