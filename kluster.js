// kluster.js

var stage = new Stage()

function add_one() {
    var width = Math.floor(Math.random() * 250) + 50;
    var height = Math.floor(Math.random() * 250) + 50;
    stage.add(new SVG.Rect().size(width, height).attr({
        fill: '#3f0'
        , 'fill-opacity': 0.4
        , stroke: '#969'
        , 'stroke-width': 5
    }))
}

function show_spaces() {
    stage.show_spaces()
}

function shuffle() {
    stage.shuffle()
}
