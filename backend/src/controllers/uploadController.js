// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,
  });
};

module.exports = {
  uploadImage,
};
