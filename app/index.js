mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og';
/*const socket = io();*/
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sardanalokesh/cjdead20tee572rlca70kz35q',
    center: [-95.712891, 37.09024],
    zoom: 3
});

const framesPerSecond = 10;
const initialOpacity = 1;
let opacity = initialOpacity;
const initialRadius = 3;
let radius = initialRadius;
const maxRadius = 10;

map.on('load', function () {

    window.setInterval(function() {
        const url = `/randomPoints?points=${Math.random()*10000}`;
        map.getSource('points').setData(url);
    }, 5000);

    /*socket.on("points", points => {
        map.getSource('points').setData(points);
    });*/

    init();
});

function init() {
    const url = `/randomPoints?points=${Math.random()*10000}`;
    map.addSource('points', {
        type: "geojson",
        data: url
    });

    map.addLayer({
        "id": "pointBgLayer",
        "source": "points",
        "type": "circle",
        "paint": {
            "circle-radius": initialRadius,
            "circle-opacity": 0,
            "circle-radius-transition": {duration: 0},
            "circle-opacity-transition": {duration: 0},
            "circle-stroke-width": 1,
            "circle-stroke-color": [
                "match",
                ["get", "type"],
                "VISITOR", "#007cbf",
                "CONVERTOR","#e6a531",
                "#f5f5f5"
            ]
        }
    });

    map.addLayer({
        "id": "pointCenterLayer",
        "source": "points",
        "type": "circle",
        "paint": {
            "circle-radius": initialRadius,
            "circle-opacity": 1,
            "circle-color": [
                "match",
                ["get", "type"],
                "VISITOR", "#007cbf",
                "CONVERTOR","#e6a531",
                "#f5f5f5"
            ]
        }
    });
    animateMarkers(0);
}




function animateMarkers(timestamp) {
    setTimeout(function(){
        requestAnimationFrame(animateMarkers);

        radius += (maxRadius - radius) / framesPerSecond;
        opacity -= ( .9 / framesPerSecond );

        if (opacity > 0) {
            map.setPaintProperty('pointBgLayer', 'circle-radius', radius);
            map.setPaintProperty('pointBgLayer', 'circle-stroke-opacity', opacity);
        } else {
            radius = initialRadius;
            opacity = initialOpacity;
        }

    }, 1000 / framesPerSecond);

}