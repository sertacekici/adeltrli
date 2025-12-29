const admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const serviceAccount = require("./fb/to/adel.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
