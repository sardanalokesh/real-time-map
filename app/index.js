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

const numberFormatter = new Intl.NumberFormat('en-US');

map.on('load', function () {

    /*window.setInterval(function() {
        const url = `/randomPoints?points=${Math.random()*10000}`;
        map.getSource('points').setData(url);
    }, 5000);*/

    /*socket.on("points", points => {
        map.getSource('points').setData(points);
    });*/

    init();
});

function init() {
    const url = `/statesData`;
    const loader = document.getElementById("loader");

    map.on("sourcedata", event => {
        if (map.getSource('points') && map.isSourceLoaded('points')) {
            loader.style.display = "none";
            setTimeout(() => {
                map.getSource('points').setData(url);
            }, 5000);
        }
    });

    map.addSource('points', {
        type: "geojson",
        data: url
    });

    map.addLayer({
        "id": "pointBgLayer",
        "source": "points",
        "type": "circle",
        "paint": {
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "visits"],
                0, 0,
                100, 2,
                10000,20
            ],
            "circle-opacity": 0,
            "circle-radius-transition": {duration: 0},
            "circle-opacity-transition": {duration: 0},
            "circle-stroke-width": 1,
            "circle-stroke-color": [
                "step",
                ["get", "visits"],
                "#7ad124",
                4000, "#e9be22",
                8000, "#f12f49"
            ]
        }
    });

    map.addLayer({
        "id": "pointCenterLayer",
        "source": "points",
        "type": "circle",
        "paint": {
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "visits"],
                0, 0,
                100, 2,
                10000,20
            ],
            "circle-opacity": 0.7,
            "circle-color": [
                "step",
                ["get", "visits"],
                "#7ad124",
                4000, "#e9be22",
                8000, "#f12f49"
            ]
        }
    });

    map.addLayer({
        "id": "points-label",
        "type": "symbol",
        "source": "points",
        "transition": {duration: 0},
        "layout": {
            "text-field": [
                "number-format",
                ["get", "visits"],
                {
                    "locale": "en-US",
                    "max-fraction-digits": 2
                }
            ],
            "text-size": 10
        },
        "paint": {
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
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
            console.log(map.getPaintProperty('pointBgLayer', 'circle-radius'));
            map.setPaintProperty('pointBgLayer', 'circle-radius', [
                "interpolate",
                ["linear"],
                ["get", "visits"],
                0, 0,
                100, 2,
                10000,20
            ]);
            map.setPaintProperty('pointBgLayer', 'circle-stroke-opacity', opacity);
        } else {
            radius = initialRadius;
            opacity = initialOpacity;
        }

    }, 1000 / framesPerSecond);

}