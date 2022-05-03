// space.js

const actor_spacing = 20;

class Space {
    constructor(x, y, x2, y2) {
        this.x = x
        this.y = y
        this.x2 = x2
        this.y2 = y2

        this.spaces = null
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
