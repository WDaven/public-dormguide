const express = require('express');

const router = express.Router();

let firestoreDb;
const initFirestoreDb = (admin) => {
    firestoreDb = admin.firestore();
}

router.get('/', async (req, res) => {
    try {
        const collection = await firestoreDb
                            .collection('dorms')
                            .get();
        const dorms = collection.docs.map(doc => doc.data());
        res.status(200).json(dorms);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            document_id,
            name,
            location,
            address,
            latitude,
            longitude,
            style,
            price_per_sem,
            capacities,
            programs,
            images
        } = req.body;
        const data = {
            name: name,
            location: location,
            address: address,
            latitude: latitude,
            longitude: longitude,
            style: style,
            price_per_sem: price_per_sem,
            capacities: capacities,
            programs: programs,
            images: images,
            num_reviews: 0,
            avg_rating: 0
        };
        await firestoreDb
            .collection('dorms')
            .doc(document_id)
            .set(data, { merge: true });
        res.status(200).json({});
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/:dorm', async (req, res) => {
    try {
        const document = await firestoreDb
                            .collection('dorms')
                            .doc(req.params.dorm)
                            .get();
        const dorm = document.data();
        res.status(200).json(dorm);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/:dorm/reviews', async (req, res) => {
    try {
        const collection = await firestoreDb
                            .collection('dorms')
                            .doc(req.params.dorm)
                            .collection('reviews')
                            .get();
        await transaction.update(dormRef, {
            num_reviews: newNumReviews,
            avg_rating: newAvgRating
        });
        const reviews = collection.docs.map(doc => {
            return { review_id: doc.id, ...doc.data() }
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/:dorm/reviews', async (req, res) => {
    const {
        rating,
        reviewer,
        title,
        text,
        date,
        pros,
        cons,
        features
    } = req.body;
    try {
        await firestoreDb.runTransaction(async (transaction) => {
            const dormRef = firestoreDb.collection('dorms').doc(req.params.dorm);
            const reviewsRef = dormRef.collection('reviews').doc();

            const document = await transaction.get(dormRef);
            const dorm = document.data();
            const newNumReviews = dorm.num_reviews + 1;
            const newAvgRating = ((dorm.avg_rating * dorm.num_reviews) + rating) / newNumReviews;

            await transaction.update(dormRef, {
                num_reviews: newNumReviews,
                avg_rating: newAvgRating
            });
            await transaction.set(reviewsRef, {
                rating: rating,
                reviewer: reviewer,
                title: title,
                text: text,
                date: date,
                pros: pros,
                cons: cons,
                features: features
            });
        });
        res.status(200).json({});
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = {
    router: router,
    initFirestoreDb: initFirestoreDb,
};