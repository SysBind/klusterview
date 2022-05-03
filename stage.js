// stage.js

const stage_width = 800;
const stage_height = 600;
const actor_spacing = 20;

class Space {
    constructor(x, y, x2, y2) {
        this.x = x
        this.y = y
        this.x2 = x2
        this.y2 = y2
    }

    width() {
        return this.x2 - this.x
    }

    height() {
        return this.y2 - this.y
    }

    place(el) {
        var x, y = 0
        // place center
        if (this.width() / el.bbox().width < 2) { 
            x = (this.width() - el.bbox().width) / 2
            y = (this.height() - el.bbox().height) / 2
        } else {  // place corner
            x = this.x +  actor_spacing
            y = this.y + actor_spacing
        }
        el.animate().move(x, y)
    }
}

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
        this.spaces = new Set([ new Space(0, 0, stage_width, stage_height) ])
    }

    add(el) {        
        this.draw.add(el)
        var space = this.find_smallest_fit(el.bbox())
        space.place(el)
        this.actors.push(el)
        recalculate_spaces()
    }

    find_smallest_fit(bbox) {
        var space = null
        this.spaces.forEach( (value) => { space = value })
        
        return space;
    }

    recalculate_spaces() {
        this.spaces.clear()
    }
}

var stage = new Stage()
stage.add(new SVG.Rect().size(200,200).attr({
  fill: '#f6c'
, 'fill-opacity': 0.7
, stroke: '#322'
, 'stroke-width': 10
}))

stage.add(new SVG.Rect().size(100,100).attr({
  fill: '#f06'
, 'fill-opacity': 0.9
, stroke: '#333'
, 'stroke-width': 10
}))

stage.add(new SVG.Rect().size(200,200).attr({
  fill: '#f60'
, 'fill-opacity': 0.9
, stroke: '#636'
, 'stroke-width': 10
}))

stage.add(new SVG.Rect().size(300,300).attr({
  fill: '#f60'
, 'fill-opacity': 0.9
, stroke: '#636'
, 'stroke-width': 10
}))

stage.add(new SVG.Rect().size(240,240).attr({
  fill: '#f30'
, 'fill-opacity': 0.1
, stroke: '#996'
, 'stroke-width': 10
}))



function add_one() {
    stage.add(new SVG.Rect().size(150,150).attr({
        fill: '#3f0'
        , 'fill-opacity': 0.1
        , stroke: '#969'
        , 'stroke-width': 10
    }))
}
