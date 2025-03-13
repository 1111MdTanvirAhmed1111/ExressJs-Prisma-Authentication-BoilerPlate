const express = require('express');
const { uploadFile, getFiles, deleteFile } = require('@/controllers/fileController'); // Updated
const authMiddleware = require('@/middleware/authMiddleware'); // Updated
const { singleUpload, multiUpload } = require('@/middleware/multerMiddleware'); // Updated
const router = express.Router();

router.use(authMiddleware);
router.post('/upload/single', singleUpload, uploadFile);
router.post('/upload/multiple', multiUpload, uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);

module.exports = router;