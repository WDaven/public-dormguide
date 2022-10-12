const express = require('express');

const router = express.Router();

let firestoreDb;
const initFirestoreDb = (admin) => {
    firestoreDb = admin.firestore();
}

router.post('/', async (req, res) => {
    try {
        const {
            token,
        } = req.body;
        const data = {
            token: token
        };
        await firestoreDb
            .collection('tokens')
            .doc()
            .set(data);
        res.status(200).json({});
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = {
    router: router,
    initFirestoreDb: initFirestoreDb,
};