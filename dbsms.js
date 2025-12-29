const admin = require("firebase-admin");
const serviceAccount = require("./fb/to/smstakip.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const dbsms = admin.firestore();

module.exports = dbsms;
