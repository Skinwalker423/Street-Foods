// const CampGround = require('/models/campgounds.js');

const lng = parseInt(longitude);
const lat = parseInt(latitude);




mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [lng, lat], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

new mapboxgl.Marker()
.setLngLat([lng, lat])
.setPopup(new mapboxgl.Popup({ closeOnClick: true, anchor: 'left', closeButton: false }).setHTML(`<p>${title}</p><p>${cityState}</p>`))
.addTo(map);



