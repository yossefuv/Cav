require('dotenv-flow').config();

module.exports = {
	prefix: process.env.PREFIX,
	owner: process.env.OWNER,
	embedColor: process.env.DEFAULT_COLOR,
	messageTimeout: process.env.MESSAGE_TIMEOUT,
};
