const axios = require('axios').default;
import G6 from '@antv/g6';

// const WIDTH = 1000;
// const HEIGHT = 700;

const WIDTH = 1000;
const HEIGHT = 1000;

export default class geopolitics {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host
        });

        this.routes = {
            relationships: "/relationships",
            countries: "/countries",
            countriesAll: "/countries/all"
        };

        this.graph = null;
    }

    getRelationships(country) {
        return this.service.get(this.routes.relationships, {
            params: {
                country: country,
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

    getAllCountries() {
        return this.service.get(this.routes.countriesAll)
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


    processGraphRaw(graphRaw) {
        const invertedRank = 101;

        const nodesRaw = graphRaw.nodes;
        let nodes = [];

        const edgesRaw = graphRaw.edges;
        let edges = [];

        nodesRaw.forEach(function(n) {
            let nodeSize = 1;
            if (n.rank > 0) {
                if (n.rank < 5) {
                    nodeSize = (invertedRank - n.rank) / 5;
                } else {
                    nodeSize = (invertedRank - n.rank) / 10;
                }
            }

            const long = n.coordinate.longitude;
            const lat = n.coordinate.latitude;

            // https://medium.com/@suverov.dmitriy/how-to-convert-latitude-and-longitude-coordinates-into-pixel-offsets-8461093cb9f5
            function degreesToRad(deg) {
                return (deg  * Math.PI) / 180
            }

            const radius = WIDTH / (2 * Math.PI);
            const FE = 180;
            const longRad = degreesToRad(long + FE);
            const x = longRad * radius;
            const latRad = degreesToRad(lat);
            const verticalOffsetFromEquator =
                radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
            const y = (HEIGHT / 2) - verticalOffsetFromEquator;


            // default
            // const x = long;
            // const y = HEIGHT - lat;

            nodes.push({
                id: n.id,
                size: nodeSize,
                x: x,
                y: y,
                label: n.key,
                labelCfg: {
                    style: {
                        fontSize: 8,
                        fill: "white",
                        opacity: 0,
                    }
                },
                style: {
                    fill: "darkgrey",
                    stroke: "grey",
                }
            })
        });

        edgesRaw.forEach(function(e) {
            edges.push({
                source: e._from,
                target: e._to,
                label: e.subject,
                labelCfg: {
                    style: {
                        fontSize: 6,
                        opacity: 0,
                    }
                },
                style: {
                    lineWidth: e.impact / 10,
                    opacity: 0.6,
                }
            })
        });

        return {
            nodes: nodes,
            edges: edges,
        }
    }

    renderGraph(graphData) {
        if (this.graph !== null) {
            this.graph.clear();
        } else {
            this.graph = new G6.Graph({
                container: 'graphNode',
                width: WIDTH,
                height: HEIGHT,

                fitView: true,
            });

            // set listeners
            let g = this.graph;
            g.on('node:mouseenter', e => {
                const nodeItem = e.item;
                g.updateItem(nodeItem, {
                    labelCfg: {
                        style: {
                            opacity: 1,
                        }
                    }
                })
            });

            g.on('node:mouseleave', e => {
                const nodeItem = e.item;
                g.updateItem(nodeItem, {
                    labelCfg: {
                        style: {
                            opacity: 0,
                        }
                    }
                })
            });
        }

        this.graph.get('container').style.backgroundImage =
            'url("http://localhost:35729/Mercator_projection_Square_scaled.png")';
        this.graph.get('container').style.backgroundSize = 'auto 100%';
        this.graph.get('container').style.backgroundRepeat = 'no-repeat';
        this.graph.get('container').style.backgroundPositionX = '7px';
        this.graph.get('container').style.backgroundPositionY = '16px';

        this.graph.data(graphData);
        this.graph.render();
    }
}