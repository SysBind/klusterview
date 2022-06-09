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
        const width = this.alloc_cpu / 30 + node_panel_size
        const height = this.alloc_mem / 1000 / 150 + 2*node_panel_size

        // svg container
        this.svg = new SVG.Svg().size(width, height)

        // main rect
        this.svg.rect(width, height - node_panel_size).attr({
            fill: '#3f0'
            , 'fill-opacity': 0.4
            , stroke: '#969'
            , 'stroke-width': 3
            ,'rx': "20px"
            ,'ry': "10px"}).move(0, node_panel_size)

        // title
        this.svg.text(this.name).size(width - node_panel_size, node_panel_size).move(10,10).attr({
            lengthAdjust: "spacingAndGlyphs"
        })

        // right panel - display allocatable memory
        this.svg.rect(node_panel_size, height * 0.5).move(width - node_panel_size, height * 0.25).attr({
                    fill: '#f3f'
                    , 'fill-opacity': 0.1
                    , stroke: '#996'
                    , 'stroke-width': 1
        })
//        this.svg.text(`${this.alloc_mem}Ki`).size(node_panel_size, height * 0.5).move(width - node_panel_size, height - node_panel_size * 0.75).attr({
//            stroke: '#0362fc',
//            fill: '#0362fc',
//            "writing-mode": "tb"            
//        })

        // bottom panel - display allocatable cpu
        this.svg.rect(width * 0.5, node_panel_size).move(width * 0.25, height - node_panel_size).attr({
            fill: 'white'
                    , 'fill-opacity': 0.1
                    , stroke: '#699'
                    , 'stroke-width': 1
        })
        this.svg.text(`${this.alloc_cpu}Mi`).size(width * 0.5, node_panel_size).move(width * 0.3, height - node_panel_size * 0.75).attr({
            stroke: '#0362fc',
            fill: '#0362fc'
        })
    }

    get SVG() {
        return this.svg
    }
}
