const axios = require('axios').default;
import G6 from '@antv/g6';

const WIDTH = 500;
const HEIGHT  = 500;

export default class relationDetails {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host,
        });

        this.routes = {
            relationshipDetails: "/relationships/details"
        };

        this.graph = null;
        this.graphData = null;
    }

    getRelationDetails(countryA, countryB) {
        return this.service.get(this.routes.relationshipDetails, {
            params: {
                countryAKey: countryA,
                countryBKey: countryB,
            }
        })
            .then(function(response) {
                return response.data.Content
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    // 2 nodes, 1 scored edge from api
    processGraphRaw(nodesRaw, edgeRaw) {
        const invertedRank = 101;

        let e = edgeRaw;
        let color = 'white';
        if (e.score > 0) {
            color = 'green'
        } else {
            color = 'red'
        }

        let edges = [
            {
                id: 'mainEdge',
                source: e._from,
                target: e._to,
                label: e.score,
                curveOffset: 20,
                style: {
                    stroke: color,
                    lineWidth: 2,
                    opacity: 1,
                },
                data: e
            }
        ];

        let nodes = [];
        let x = 10;
        nodesRaw.forEach(function(n) {
            // adjust node size with rank
            let nodeSize = 5;
            if (n.rank !== -1) {
                nodeSize = invertedRank - n.rank;
            }

            nodes.push({
                id: n.id,
                x: x,
                y: 10,
                size: nodeSize,
                label: n.name,
                style: {
                    lineWidth: nodeSize / 10,
                    fill: 'darkblue',
                    stroke: color
                },
                data: n,
            });

            x += 200;
        });

        return {
            nodes: nodes,
            edges: edges,
        }
    }

    renderGraph(graphData) {

        if (this.graph != null) {
            this.graph.clear();
        } else {
            this.graph = new G6.Graph({
                container: 'relationDetailNode',
                width: WIDTH,
                height: HEIGHT,
                fitView: true,
                linkCenter: true,

                // defaults
                defaultNode: {
                    labelCfg: {
                        style: {
                            fontSize: 12,
                            fill: 'white',
                            opacity: 1,
                        }
                    },
                    style: {
                        fill: 'darkblue',
                        stroke: 'blue'
                    }
                },
                defaultEdge: {
                    type: 'arc',
                    curveOffset: 20,
                    labelCfg: {
                        style: {
                            opacity: 0,
                        }
                    },
                    style: {
                        lineWidth: 2,
                        opacity: 1,
                    }
                },
            })
        }

        this.graphData = graphData;
        this.graph.data(graphData);
        this.graph.render();
    }

    clearGraph() {
        this.graph = null;
        this.graphData = null;
    }
}