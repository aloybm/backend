import admin from 'firebase-admin'  
// var admin = require("firebase-admin");
import serviceAccount from '../serviceAccountKey.json' assert {type: "json"}
// var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
const adminAuth = admin.auth()

// module.exports = admin.firestore()
export { db, adminAuth }