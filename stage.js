// stage.js

const stage_width = 800;
const stage_height = 600;
const actor_spacing = 10;

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
    }

    add(el) {        
        this.draw.add(el)

        for (const actor of this.actors) {            
            window.console.log('checking collistion with '  + actor)
            window.console.log(actor.bbox())
            window.console.log(el.bbox())

            if (el.bbox().x < actor.bbox().x2 &&
                el.bbox().x2 > actor.bbox().x &&
                el.bbox().y < actor.bbox().y2 &&
                el.bbox().y2 > actor.bbox().y) {
                console.log("COLLISIONS!");
                // move X ?
                if (actor.bbox().x2 + el.bbox().width  < stage_width  + actor_spacing) {
                    el.animate().move(actor.bbox().width + actor_spacing, 0)
                } else {
                    el.animate().move(0, actor.bbox().height  + actor_spacing)
                }
               
            }
        }
        this.actors.push(el)
    }
}

var stage = new Stage()
stage.add(new SVG.Rect().size(200,200))
stage.add(new SVG.Rect().size(100,300).attr({
  fill: '#f06'
, 'fill-opacity': 0.9
, stroke: '#333'
, 'stroke-width': 10
}))
stage.add(new SVG.Rect().size(100,100).attr({
  fill: '#f60'
, 'fill-opacity': 0.9
, stroke: '#636'
, 'stroke-width': 10
}))

