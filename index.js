require('dotenv').config();

const cLogClient = require('./core/client.js');
const client = new cLogClient();

client.login(process.env.TOKEN);