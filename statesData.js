const fs = require("fs");

const stateCentersFile = "geojson/stateCenters.geojson";
const stateCenters = JSON.parse(fs.readFileSync(stateCentersFile, "utf8"));
let previousData;

function statesData(reset) {
    stateCenters.features.forEach((feature,i) => {
        if (previousData && !reset) {
            let prevVal = parseInt(previousData.features[i].properties.visits);
            let newVal = prevVal + (Math.random() > 0.5 ? -1 : 1)*Math.round(Math.random()*1000);
            feature.properties.visits = newVal > 0 ? newVal : 100;
        } else {
            feature.properties.visits = Math.round(Math.random()*10000);
        }
    });
    previousData = stateCenters;
    return stateCenters;
}

exports.statesData = statesData;