// node.js

const node_panel_size = 30

/**
   KNode - Represents Kubernetes Node
 */
class KNode {
    /**
     * @param {number} width
     * @param {number} height
     * @returns {Node}
     */
    constructor(name, alloc_cpu, alloc_mem) {
        this.name = name
        this.alloc_cpu = alloc_cpu
        this.alloc_mem = alloc_mem

        // Graphic Representation
        this.svg = new SVG.Svg().size(this.alloc_cpu, this.alloc_mem + node_panel_size)
        this.svg.rect(this.alloc_cpu, this.alloc_mem).attr({
                    fill: '#3f0'
                    , 'fill-opacity': 0.4
                    , stroke: '#969'
                    , 'stroke-width': 5
        }).move(0, node_panel_size)

        this.svg.text(this.name).size(this.alloc_cpu, node_panel_size).move(10,10)
    }

    get SVG() {
        return this.svg
    }
}
