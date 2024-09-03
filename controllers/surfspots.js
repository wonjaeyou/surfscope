const Surfspot = require('../models/surfspot');
const { cloudinary } = require('../cloudinary');

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async(req, res) => {
    const surfspots = await Surfspot.find({});
    res.render('surfspots/index', { surfspots });
}

module.exports.renderNewForm = (req, res) => {
    res.render('surfspots/new');
}

module.exports.addNewSpot = async(req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.surfspot.location, { limit: 1 });
    const surfspot = new Surfspot(req.body.surfspot);
    surfspot.geometry = geoData.features[0].geometry;
    surfspot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    surfspot.author = req.user._id;
    await surfspot.save();
    console.log(surfspot);
    req.flash('success', 'Successfully Added!');
    res.redirect(`/surfspots/${surfspot._id}`);
}

module.exports.showSpot = async(req, res) => {
    const spot = await Surfspot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!spot) {
        req.flash('error', 'Spot not found! Try another spot.')
        return res.redirect('/surfspots');
    }
    res.render('surfspots/show', { spot });
}

module.exports.editSpot = async(req, res) => {
    const spot = await Surfspot.findById(req.params.id);
    if (!spot) {
        req.flash('error', 'Spot not found! Try another spot.')
        return res.redirect('/surfspots');
    }

    res.render('surfspots/edit', { spot });
}

module.exports.updateSpot = async(req, res) => {
    const { id } = req.params;
    const spot = await Surfspot.findByIdAndUpdate(id, {...req.body.surfspot });
    const geoData = await maptilerClient.geocoding.forward(req.body.spot.location, { limit: 1 });
    spot.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    spot.images.push(...imgs);
    await spot.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully Updated the Spot!');
    res.redirect(`/surfspots/${spot._id}`);
}

module.exports.deleteSpot = async(req, res) => {
    const { id } = req.params;
    const surfspot = await Surfspot.findById(id);
    if (!surfspot.author.equals(req.user._id)) {
        req.flash('error', 'No Permission!');
        return res.redirect(`/surfspots/${id}`);
    }

    await Surfspot.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted!');
    res.redirect('/surfspots');
}