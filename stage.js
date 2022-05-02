// stage.js

const stage_width = 800;
const stage_height = 600;
const actor_spacing = 10;

const sleep = ms => new Promise(r => setTimeout(r, ms))

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
    }

    add(el) {        
        this.draw.add(el)

        var target_bbox = el.bbox()
        var xcount = 0        
        for (const actor of this.actors) {
            xcount += 1
            let xspacing = xcount * actor_spacing
            window.console.log('considering ' + actor)            
            let real_bbox = actor.remember('target_bbox')
            window.console.log(real_bbox)
            window.console.log(target_bbox)
            if (target_bbox.x < real_bbox.x2 &&
                target_bbox.x2 > real_bbox.x &&
                target_bbox.y < real_bbox.y2 &&
                target_bbox.y2 > real_bbox.y) {
                window.console.log('COLLISIONS!')
                // move X ?
                if (real_bbox.x2 + target_bbox.width  < (stage_width  + xspacing)) {
                    target_bbox.x = real_bbox.x2 + xspacing
                    target_bbox.x2 = target_bbox.x + target_bbox.width
                } else {
                    target_bbox.y = real_bbox.height  + actor_spacing
                    target_bbox.y2 = target_bbox.y + target_bbox.height
                    xcount = 0
                }
                window.console.log(target_bbox)
                window.console.log(el.animate().move(target_bbox.x, target_bbox.y))
            }
        }
        el.remember('target_bbox', target_bbox)
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

stage.add(new SVG.Rect().size(400,100).attr({
  fill: '#f60'
, 'fill-opacity': 0.9
, stroke: '#636'
, 'stroke-width': 10
}))

stage.add(new SVG.Rect().size(200,200).attr({
  fill: '#f30'
, 'fill-opacity': 0.1
, stroke: '#996'
, 'stroke-width': 10
}))

