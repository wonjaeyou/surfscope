maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.Bright,
    center: spot.geometry.coordinates,
    zoom: 10
})

new maptilersdk.Marker()
    .setLngLat(spot.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
        .setHTML(
            `<h2>${spot.title}</h2><p>${spot.location}</p>`
        )
    )
    .addTo(map)