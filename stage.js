// stage.js

const stage_width = 800;
const stage_height = 600;
const actor_spacing = 20;

const sleep = ms => new Promise(r => setTimeout(r, ms))

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
    }

    add(el) {        
        this.draw.add(el)

        var target_bbox = el.bbox()
        var max_y = 0
        for (const actor of this.actors) {            

            let real_bbox = actor.remember('target_bbox')
            if (real_bbox.y2 > max_y)
                max_y = real_bbox.y2
            
            window.console.log(real_bbox)
            window.console.log(target_bbox)
            if (target_bbox.x < real_bbox.x2 &&
                target_bbox.x2 > real_bbox.x &&
                target_bbox.y < real_bbox.y2 &&
                target_bbox.y2 > real_bbox.y) {
                window.console.log('COLLISIONS!')
                // move X ?
                if (real_bbox.x2 + target_bbox.width  < (stage_width  + actor_spacing)) {
                    target_bbox.x = real_bbox.x2 + actor_spacing
                    target_bbox.x2 = target_bbox.x + target_bbox.width
                    window.console.log('move x')
                } else {
                    target_bbox.y = max_y  + actor_spacing
                    target_bbox.y2 = target_bbox.y + target_bbox.height
                    target_bbox.x = 0
                    target_bbox.x2 = target_bbox.x + target_bbox.width
                }
                el.animate().move(target_bbox.x, target_bbox.y)
            }
        }
        el.remember('target_bbox', target_bbox)
        this.actors.push(el)
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

stage.add(new SVG.Rect().size(100,100).attr({
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


stage.add(new SVG.Rect().size(150,150).attr({
  fill: '#3f0'
, 'fill-opacity': 0.1
, stroke: '#969'
, 'stroke-width': 10
}))

