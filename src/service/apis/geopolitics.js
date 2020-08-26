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


        this.backgroundConf = {
            "amerNorth": {
                "img": 'url("/images/Map_of_populous_North_America.jpg")',
                "x": "-300px",
                "y": "30px",
                "zoom": "100%"
            },
            "amerSouth": {
                "img": 'url("/images/Map_of_South_America.jpg")',
                "x": "10px",
                "y": "-80px",
                "zoom": "160%"
            },
            "europe": {
                "img": 'url("/images/Map_of_populous_Europe.jpg")',
                "x": "105px",
                "y": "130px",
                "zoom": "80%"
            },
            "oceania": {
                "img": 'url("/images/Map_of_Oceania.jpg")',
                "x": "-100px",
                "y": "-185px",
                "zoom": "135%",
            },
            "africa": {
                "img": 'url("/images/Map_of_Africa.jpeg")',
                "x": "-40px",
                "y": "30px",
                "zoom": "94%",
            },
            "asia": {
                "img": 'url("/images/Map_of_Asia.png")',
                "x": "32px",
                "y": "40px",
                "zoom": "86%"
            },
            "": {
                "img": 'url("/images/Mercator_projection_Square_scaled.png")',
                "x": "7px",
                "y": "16px",
                "zoom": "100%"
            }
        };

        this.graph = null;
        this.selectedNode = null;
    }

    selectedNodePop() {
        let c = 0;
        let u = "";

        if (this.selectedNode !== null) {
            let m = this.selectedNode.population / 1000000;

            if (m > 1000) {
                // billions
                let b = this.selectedNode.population / 1000000000;
                c = Math.round(b * 100) / 100;
                u = "B";
            } else {
                // millions
                c = Math.round(m * 100) / 100;
                u = "M";
            }
        }

        return `${c} ${u}`;
    }

    selectedNodeCoordinates() {
        let latitude = Math.round(this.selectedNode.coordinate.latitude * 100) / 100;
        let longitude = Math.round(this.selectedNode.coordinate.longitude * 100) / 100;

        let longS = "";
        let latS = "";
        if (latitude < 0) {
            latS = `${-latitude}S`
        } else {
            latS = `${latitude}N`
        }

        if (longitude < 0) {
            longS = `${-longitude}O`
        } else {
            longS = `${longitude}E`
        }

        return `${latS} ${longS}`
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

    getAllCountries(region) {
        return this.service.get(this.routes.countriesAll, {
            params: {
                region: region,
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

    processGraphRaw(graphRaw) {
        const invertedRank = 101;

        const nodesRaw = graphRaw.nodes;
        let nodes = [];

        const edgesRaw = graphRaw.edges;
        let edges = [];

        nodesRaw.forEach(function(n) {
            let nodeSize = 5;
            if (n.rank > 0) {
                if (n.rank <= 5) {
                    nodeSize = (invertedRank - n.rank) / 3;
                } else if (n.rank <= 10) {
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
                        fontSize: 12,
                        fill: "white",
                        opacity: 0,
                    }
                },
                style: {
                    lineWidth: nodeSize / 10,
                    fill: "darkgrey",
                    stroke: "grey",
                },
                data: n
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

    renderGraph(graphData, region) {
        let self = this;

        if (this.graph !== null) {
            this.graph.clear();
        } else {
            this.graph = new G6.Graph({
                container: 'graphNode',
                width: WIDTH,
                height: HEIGHT,

                fitView: true,

                nodeStateStyles: {
                    click: {
                        stroke: 'lightgrey',
                    }
                }
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

            g.on('node:click', e => {
                // Swich the 'click' state of the node to be false
                const clickNodes = g.findAllByState('node', 'click');
                clickNodes.forEach(cn => {
                    g.setItemState(cn, 'click', false);
                });

                const nodeItem = e.item;
                g.setItemState(nodeItem, 'click', true);
                self.selectedNode = nodeItem._cfg.model.data;
            })
        }

        if (region !== null) {
            this.graph.get('container').style.backgroundRepeat = 'no-repeat';

            let bgConf = this.backgroundConf[region];
            if (bgConf === undefined) {
                // no conf found, deactivate bg
                this.graph.get('container').style.backgroundSize = 'auto 0%';
            } else {
                // use conf
                this.graph.get('container').style.backgroundImage = bgConf.img;
                this.graph.get('container').style.backgroundPositionX = bgConf.x;
                this.graph.get('container').style.backgroundPositionY = bgConf.y;
                this.graph.get('container').style.backgroundSize = `auto ${bgConf.zoom}`;
            }

        } else {
            this.graph.get('container').style.backgroundSize = 'auto 0%';
        }

        // render
        this.graph.data(graphData);
        this.graph.render();
    }
}