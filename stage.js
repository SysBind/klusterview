// stage.js

class Stage {
    constructor(selector = "#stage") {
        this.draw = SVG().addTo(selector).size(800, 600)
        this.actors = new SVG.List()
    }

    add(el) {
        this.actors.push(el)
        this.draw.add(el)
    }
}

var stage = new Stage()
stage.add(new SVG.Rect().size(200,200))

