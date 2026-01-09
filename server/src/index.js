require("dotenv").config();

require("./configs/database.config");
require("./configs/cron.config");

const listenServer = require("./configs/server.config");
const expressApp = require("./configs/expressApp.config");

listenServer(expressApp);
