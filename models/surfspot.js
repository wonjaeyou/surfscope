const mongoose = require('mongoose');
const Reviews = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const surfspotSchema = new Schema({
    title: String,
    // currentCondition: String,
    // windStr: String,
    // windDir: String,
    // waveMinHeight: String,
    // waveMaxHeight: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, opts);

surfspotSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/surfspots/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,50)}...</p>
    `;
});

surfspotSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Reviews.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Surfspots', surfspotSchema);