const axios = require('axios').default;
import G6 from '@antv/g6';

const WIDTH = 1000;
const HEIGHT = 700;

export default class geopolitics {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host
        });

        this.routes = {
            // todo
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
            if (n.rank !== -1 && n.rank > 0) {
                nodeSize = (invertedRank - n.rank) / 10;
            }

            nodes.push({
                id: n.id,
                size: nodeSize,
                x: n.coordinate.longitude,
                y: HEIGHT - n.coordinate.latitude,
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
        }

        this.graph.get('container').style.backgroundImage = 'url("../../../assets/backgrounds/world_map.jpeg")';
        this.graph.get('container').style.backgroundSize = 'auto 100%';

        this.graph.data(graphData);
        this.graph.render();
    }
}