// space.js

const actor_spacing = 10;

class Space {
    constructor(x, y, x2, y2) {
        this.x = x
        this.y = y
        this.x2 = x2
        this.y2 = y2

        this.spaces = new Set()
    }

    width() {
        return this.x2 - this.x
    }

    height() {
        return this.y2 - this.y
    }

    place(el) {
        window.console.log('place', this)        
        var x = this.x + actor_spacing
        var y = this.y + actor_spacing
        this.devide_space_corner(x, y, el.bbox().width, el.bbox().height)        
        el.animate().move(x, y)        
    }

    devide_space_corner(x, y, width, height) {
        this.spaces.add(new Space(x + width, y, this.x2, y + height))
        this.spaces.add(new Space(x, y + height, x + width, this.y2))
        this.spaces.add(new Space(x + width, y + height, this.x2, this.y2))
    }

    find_space(bbox) {
        if ((this.spaces.size == 0))
            return this

        var space = null
        for (const entry of this.spaces.entries() ) {
            var curspace = entry[0].find_space(bbox)
            if (curspace == null)
                continue
            
            if ((curspace.width() < bbox.width) || (curspace.height() < bbox.height)) {
                window.console.log('skipping small space', curspace)
                continue
            }

            if (space == null) {
                space = curspace
                continue
            }
            
            if (curspace.width() < space.width() || curspace.height() < space.height() )
                space = curspace
        }
        window.console.log('find_space return', space)
        return space
    }
}
