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
        this.width = this.alloc_cpu / 30 + node_panel_size
        this.height = this.alloc_mem / 1000 / 100 + 2*node_panel_size

        // svg container
        this.svg = new SVG.Svg().size(this.width, this.height)
        this.svg.click(function(e) {
            var audio = new Audio('sounds/menu-selection-click.wav')
            audio.play()
        });

        // main rect
        this.svg.rect(this.width, this.height - node_panel_size).attr({
            fill: '#3f0'
            , 'fill-opacity': 0.4
            , stroke: '#969'
            , 'stroke-this.width': 3
            ,'rx': "20px"
            ,'ry': "10px"}).move(0, node_panel_size)

        // title
        this.svg.text(this.name).size(this.width - node_panel_size, node_panel_size).move(10,10).attr({
            lengthAdjust: "spacingAndGlyphs"
        })

        // right panel - display allocatable memory
        this.svg.rect(node_panel_size, this.height * 0.5).move(this.width - node_panel_size, this.height * 0.25).attr({
                    fill: '#f3f'
                    , 'fill-opacity': 0.1
                    , stroke: '#996'
                    , 'stroke-this.width': 1
        })
        
        const mem_gig = Math.round(this.alloc_mem / 1000 / 1000 )
        this.svg.text(`${mem_gig}Gi`).size(node_panel_size, this.height * 0.5).move(this.width - node_panel_size * 0.6, this.height * 0.3).attr({
            stroke: '#0362fc',
            fill: '#0362fc',
            "writing-mode": "tb"            
        })

        // bottom panel - display allocatable cpu
        this.bottomPannel()
    }


    bottomPannel() {
        this.svg.rect(this.width * 0.5, node_panel_size).move(this.width * 0.25, this.height - node_panel_size).attr({
            fill: 'white'
                    , 'fill-opacity': 0.1
                    , stroke: '#699'
                    , 'stroke-this.width': 1
        })
        this.svg.text(`${this.alloc_cpu}Mi`).size(this.width * 0.5, node_panel_size).move(this.width * 0.3, this.height - node_panel_size * 0.75).attr({
            stroke: '#0362fc',
            fill: '#0362fc'
        })        
    }
    
    // SVG: Getter
    get SVG() {
        return this.svg
    }
}
