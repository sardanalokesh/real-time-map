const fs = require("fs");
const center = require("@turf/center").default;

const STATES_GEOJSON_FILE = "geojson/us-states.geojson";
const geojson = JSON.parse(fs.readFileSync(STATES_GEOJSON_FILE, "utf-8"));

/*const output = {
    type: "FeatureCollection",
    features: []
};*/

geojson.features = geojson.features.map(feature => center(feature, {
    properties: {
        name: feature.properties.NAME
    }
}));

fs.writeFileSync("geojson/stateCenters.geojson", JSON.stringify(geojson), "utf8");