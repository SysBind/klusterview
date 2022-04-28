// stage.js

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(800, 600)
        this.actors = new SVG.List()
    }

    add(el) {        
        this.draw.add(el)

        for (const actor of this.actors) {            
            window.console.log('checking collistion with '  + actor)
            
        }
        this.actors.push(el)
    }
}

var stage = new Stage()
stage.add(new SVG.Rect().size(200,200))
stage.add(new SVG.Rect().size(100,300))

