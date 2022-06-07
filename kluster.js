// kluster.js

var stage = new Stage()
var redis = new Redis()

redis.GET('samples').then( function(samples) {
    console.log(`SAMPLES: ${samples}`)
    redis.SMEMBERS(`sample:${samples}:nodes`).then( function(nodes) {
        nodes.forEach(function(node) {            
            redis.MGET(`node:${node}:alloc_cpu`, `node:${node}:alloc_mem`).then(function (val) {
                console.log(`NODE  ${node}`)
                alloc_cpu = val[1].substring(0, val[1].length - 1) / 50
                alloc_mem = val[2].substring(0, val[2].length - 2) / 1000 / 100
                console.log(`cpu: ${alloc_cpu}`)
                console.log(`mem: ${alloc_mem}`)
                stage.add(new SVG.Rect().size(alloc_cpu, alloc_mem).attr({
                    fill: '#3f0'
                    , 'fill-opacity': 0.4
                    , stroke: '#969'
                    , 'stroke-width': 5
                }))
            })
        })
    })
})


// debugging stuff
function add_one() {
    var width = Math.floor(Math.random() * 250) + 50;
    var height = Math.floor(Math.random() * 250) + 50;
    stage.add(new SVG.Rect().size(width, height).attr({
        fill: '#3f0'
        , 'fill-opacity': 0.4
        , stroke: '#969'
        , 'stroke-width': 5
    }))
}

function show_spaces() {
    stage.show_spaces()
}

function shuffle() {
    stage.shuffle()
}