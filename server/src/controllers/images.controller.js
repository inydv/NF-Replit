const { catchAsyncError, errorHandler } = require("../helpers");
const cloudinary = require("cloudinary").v2;

class imagesController {
  deleteImageFromCloudinary = catchAsyncError(async (req, res, next) => {
    const { images } = req.body;

    try {
      await Promise.all(
        images.map((img) => cloudinary.uploader.destroy(img.public_id))
      );
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Images Deleted Successfully successfully",
    });
  });
}

module.exports = new imagesController();
