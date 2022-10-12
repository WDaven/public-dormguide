const express = require('express');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dorms = require('./routes/dorms');
const media = require('./routes/media');
const reports = require('./routes/reports');
const tokens = require('./routes/tokens');

admin.initializeApp();
dorms.initFirestoreDb(admin);
media.initStorage(admin);
reports.initFirestoreDb(admin);
tokens.initFirestoreDb(admin);

const app = express();

app.use('/dorms', dorms.router);
app.use('/media', media.router);
app.use('/reports', reports.router);
app.use('/tokens', tokens.router);

exports.app = functions.https.onRequest(app);