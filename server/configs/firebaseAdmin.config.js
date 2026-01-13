require("dotenv").config();
const admin = require("firebase-admin");
let serviceAccount;

if (process.env.NODE_ENV === "DEVELOPMENT") {
  serviceAccount = require("../constants/firebaseTest.constant.json");
} else {
  serviceAccount = require("../constants/firebase.constant.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
