// node.js

/**
   KNode - Represents Kubernetes Node
 */
class KNode {
    /**
     * @param {number} width
     * @param {number} height
     * @returns {Node}
     */
    constructor(alloc_cpu, alloc_mem) {
        this.alloc_cpu = alloc_cpu
        this.alloc_mem = alloc_mem

        // Graphic Representation
        this.svg = new SVG.Svg().size(this.alloc_cpu, this.alloc_mem)
        this.svg.rect(this.alloc_cpu, this.alloc_mem).attr({
                    fill: '#3f0'
                    , 'fill-opacity': 0.4
                    , stroke: '#969'
                    , 'stroke-width': 5
        })
        
/*        this.svg = new SVG.Rect().size(this.alloc_cpu, this.alloc_mem).attr({
                    fill: '#3f0'
                    , 'fill-opacity': 0.4
                    , stroke: '#969'
                    , 'stroke-width': 5
        })*/
    }

    get SVG() {
        return this.svg
    }
}
