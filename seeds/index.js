const mongoose = require('mongoose');
const Surfspot = require('../models/surfspot')
const cities = require('./cities');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/surf-scope');
    console.log('Database Connected')
}

const seedDB = async() => {
    await Surfspot.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        const spot = new Surfspot({
            //YOUR USER ID
            author: '66d2d970d405f7acf458c2d0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${cities[random1000].city} Surfspot`,
            description: 'this is the description text!',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [{
                url: 'https://res.cloudinary.com/dbhy2rkaa/image/upload/v1725112108/SurfScope/mbhjck88zajcrfhjdcvb.jpg',
                filename: 'SurfScope/mbhjck88zajcrfhjdcvb',
            }]
        })

        await spot.save()
    }
}

seedDB();