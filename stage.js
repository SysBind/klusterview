// stage.js

const stage_width = 800;
const stage_height = 600;

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
        this.root_space = new Space(0, 0, stage_width, stage_height)
    }

    add(el) {        
        this.draw.add(el)
        var space = this.root_space.find_space(el.bbox())
        space.place(el)
        this.actors.push(el)        
    }

    draw_spaces(space = this.root_space) {
        this.draw.rect(space.width(), space.height()).move(space.x, space.y).attr({
            fill: '#3f0'
            , 'fill-opacity': 0
            , stroke: '#969'
            , 'stroke-width': 1
        })

        for (const entry of space.spaces.entries()) {            
            this.draw_spaces(entry[0])
        }
    }
}




var stage = new Stage()
stage.add(new SVG.Rect().size(200,200).attr({
  fill: '#f6c'
, 'fill-opacity': 0.7
, stroke: '#322'
, 'stroke-width': 5
}))

// stage.add(new SVG.Rect().size(100,100).attr({
//   fill: '#f06'
// , 'fill-opacity': 0.9
// , stroke: '#333'
// , 'stroke-width': 10
// }))

// stage.add(new SVG.Rect().size(200,200).attr({
//   fill: '#f60'
// , 'fill-opacity': 0.9
// , stroke: '#636'
// , 'stroke-width': 10
// }))

// stage.add(new SVG.Rect().size(300,300).attr({
//   fill: '#f60'
// , 'fill-opacity': 0.9
// , stroke: '#636'
// , 'stroke-width': 10
// }))

// stage.add(new SVG.Rect().size(240,240).attr({
//   fill: '#f30'
// , 'fill-opacity': 0.1
// , stroke: '#996'
// , 'stroke-width': 10
// }))



function add_one() {
    var size = Math.floor(Math.random() * 300);
    stage.add(new SVG.Rect().size(size, size).attr({
        fill: '#3f0'
        , 'fill-opacity': 0.4
        , stroke: '#969'
        , 'stroke-width': 5
    }))
}

function draw_spaces() {
    stage.draw_spaces()
}
