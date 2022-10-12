const express = require('express');

const router = express.Router();

let storage;
const initStorage = (admin) => {
    storage = admin.storage();
}

router.get('/:dorm', async (req, res) => {
    try {
        const files = await storage.bucket().getFiles({ prefix: req.params.dorm + '/' });
        const media = files[0].filter(file => {
            return file.metadata.contentType.includes('image/') || file.metadata.contentType.includes('video/');
        }).map(file => {
            return "https://firebasestorage.googleapis.com/v0/b/mas-project-4261.appspot.com/o/"
                    + file.id
                    + "?alt=media&token="
                    + file.metadata.metadata.firebaseStorageDownloadTokens;
        });
        res.status(200).json(media);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = {
    router: router,
    initStorage: initStorage,
};