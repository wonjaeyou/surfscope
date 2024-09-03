//Database Get
const Surfspot = require('../models/surfspot');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const spot = await Surfspot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Your review has been added. Thank you!');
    res.redirect(`/surfspots/${spot._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Surfspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Your review has been deleted!');
    res.redirect(`/surfspots/${id}`);
}