const express = require('express');

const router = express.Router();

let firestoreDb;
const initFirestoreDb = (admin) => {
    firestoreDb = admin.firestore();
}

router.post('/', async (req, res) => {
    try {
        const {
            dorm,
            review_id,
            reviewer,
            title,
            text,
            date
        } = req.body;
        const data = {
            dorm: dorm,
            review_id: review_id,
            reviewer: reviewer,
            title: title,
            text: text,
            date: date
        };
        await firestoreDb
            .collection('reports')
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