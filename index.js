var tilebelt = require('tilebelt'),
    turf = require('turf');

var data = require('./france.json'),
    myResult = [];

var bbox = turf.bbox(data);
var startTile = tilebelt.bboxToTile(bbox);
var perimetre = data.features[0]

var diff = turf.difference(
    tilebelt.tileToGeoJSON(startTile),
    perimetre)

var main = function(perimetre, perimetreStart, child) {
    var featureChild = turf.feature(tilebelt.tileToGeoJSON(child))
    //if (turf.union(featureChild, perimetre).geometry.type === 'MultiPolygon') return false
    if (!turf.intersect(featureChild,perimetre)) {
        myResult.push(featureChild);
        return false
    }
    if (!turf.intersect(featureChild,perimetreStart)) {
        return false
    }
    recursive(child, perimetre, perimetreStart)
    return true
}
var recursive = function (tile, perimetre, perimetreStart) {
    if (tile[2] > 13) return false;
    var childs = tilebelt.getChildren(tile)
    childs.forEach(
        main.bind(null, perimetre, perimetreStart)
    )
}

recursive(startTile, diff, perimetre)

console.log(JSON.stringify(turf.featureCollection(myResult)));
