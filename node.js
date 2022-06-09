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

        // total graphic width & height
        const width = this.alloc_cpu + node_panel_size
        const height = this.alloc_mem + 2*node_panel_size

        // svg container
        this.svg = new SVG.Svg().size(width, height)

        // main rect
        this.svg.rect(this.alloc_cpu, this.alloc_mem).attr({
                    fill: '#3f0'
                    , 'fill-opacity': 0.4
                    , stroke: '#969'
                    , 'stroke-width': 5
        }).move(0, node_panel_size)

        // title
        this.svg.text(this.name).size(this.alloc_cpu, node_panel_size).move(10,10)

        // external right panel
        this.svg.rect(node_panel_size, height * 0.5).move(width - node_panel_size, height * 0.25).attr({
                    fill: '#f3f'
                    , 'fill-opacity': 0
                    , stroke: '#699'
                    , 'stroke-width': 5
        })

        // external bottom panel
        this.svg.rect(width * 0.5, node_panel_size).move(width * 0.25, height - node_panel_size).attr({
            fill: 'white'
                    , 'fill-opacity': 0
                    , stroke: '#699'
                    , 'stroke-width': 5
        })        
    }

    get SVG() {
        return this.svg
    }
}
