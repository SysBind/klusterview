// stage.js

const stage_width = 1024;
const stage_height = 768;

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(stage_width, stage_height)
        this.actors = new SVG.List()
        this.root_space = new Space(0, 0, stage_width, stage_height)
    }

    add(el) {        
        this.draw.add(el)
        var space = this.root_space.find_space(el.bbox())
        if (space == null) {
            window.console.log('no space found, shuffling...')
            this.shuffle()
            space = this.root_space.find_space(el.bbox())
        }

        if (space == null) {
            el.animate().attr({ fill: '#f00', 'fill-opacity': 1 })
            el.animate({wait: 2000}).attr({ fill: '#f00', 'fill-opacity': 0, 'stroke-width': 0 })
            return
        }
        space.place(el)
        this.actors.push(el)        
    }

    show_spaces(space = this.root_space, wait = 0) {
        if (space.spaces.size == 0) {        
            var rect = this.draw.rect(space.width(), space.height()).move(space.x, space.y).attr({
                fill: '#f03'
                , 'fill-opacity': 1
                , stroke: '#969'
                , 'stroke-width': 3
            })        
            rect.animate({duration: 1000,
                          wait: wait}).attr({'fill-opacity': 0, 'stroke-width': 1})

            return
        }

        for (const entry of space.spaces.entries()) {            
            this.show_spaces(entry[0], wait + 1000)
        }
    }

    shuffle() {
        this.root_space = new Space(0, 0, stage_width, stage_height)
        this.actors = this.actors.sort( (a, b) => { return (a.bbox().width <  b.bbox().width) } )
        for (const act of this.actors) {            
            let space = this.root_space.find_space(act.bbox())
            space.place(act)
        }
    }
}
