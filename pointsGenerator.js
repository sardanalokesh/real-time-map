const fs = require("fs");
const bbox = require("@turf/bbox").default;
const randomPoint = require("@turf/random").randomPoint;
const pointsWithinPolygon = require("@turf/points-within-polygon").default;

function getRandomPoints(count, geojson) {
    return new Promise((resolve, reject) => {
        try {
            const bb = bbox(geojson);
            const points = pointsWithinPolygon(randomPoint(count, {bbox: bb}), geojson);
            points.features.forEach(f => {
                f.properties["type"] = Math.random() > 0.5 ? "VISITOR" : "CONVERTOR";
            });
            resolve(points);
        } catch (e) {
            reject(e);
        }
    });
}

exports.randomPoints = getRandomPoints;