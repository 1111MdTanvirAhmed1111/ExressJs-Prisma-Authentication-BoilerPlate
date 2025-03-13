const prisma = require('@/config/database'); // Updated
const fs = require('fs').promises;
const path = require('path');

const uploadFile = async (req, res, next) => {
  try {
    const files = req.files || [req.file];
    if (!files) throw new Error('No file uploaded');

    const imageRecords = await Promise.all(
      files.map((file) =>
        prisma.image.create({
          data: {
            filename: file.filename,
            path: file.path,
            userId: req.user.id,
          },
        })
      )
    );

    res.status(201).json({
      status: 'success',
      data: imageRecords,
    });
  } catch (error) {
    next(error);
  }
};

const getFiles = async (req, res, next) => {
  try {
    const images = await prisma.image.findMany({
      where: { userId: req.user.id },
    });

    res.json({
      status: 'success',
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!image) throw new Error('Image not found');

    await fs.unlink(image.path);
    await prisma.image.delete({ where: { id: image.id } });

    res.json({
      status: 'success',
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getFiles, deleteFile };