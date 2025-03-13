const express = require('express');
const { uploadFile, getFiles, deleteFile } = require('@/controllers/fileController');
const authMiddleware = require('@/middleware/authMiddleware');
const { singleUpload, multiUpload } = require('@/middleware/multerMiddleware');
const { validate, schemas } = require('@/middleware/validationMiddleware');
const router = express.Router();

router.use(authMiddleware);

// File uploads don’t need body validation (Multer handles it)
router.post('/upload/single', singleUpload, uploadFile);
router.post('/upload/multiple', multiUpload, uploadFile);

// No validation needed for GET (no user input)
router.get('/', getFiles);

// Validate params for DELETE
router.delete('/:id', validate(schemas.deleteFile, 'params'), deleteFile);

module.exports = router;