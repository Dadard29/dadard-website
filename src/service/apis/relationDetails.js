const axios = require('axios').default;
const html = require('gridjs').html;
const moment = require('moment');

let chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

let COLORS = [
    chartColors.red,
    chartColors.orange,
    chartColors.yellow,
    chartColors.green,
    chartColors.blue,
    chartColors.purple,
    chartColors.grey,
];

export default class relationDetails {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host,
        });

        this.routes = {
            relationshipDetails: "/relationships/details"
        };

        this.edgeScore = null;
        this.edgeHistory = null;
        this.countryA = null;
        this.countryB = null;

        this.edgeHistoryDataset = null;
    }

    getRelationDetails(countryA, countryB) {
        let self = this;
        return this.service.get(this.routes.relationshipDetails, {
            params: {
                countryAKey: countryA,
                countryBKey: countryB,
            }
        })
            .then(function(response) {
                let results = response.data.Content;
                self.countryA = results.nodes[0];
                self.countryB = results.nodes[1];

                self.edgeHistory = results.edgeHistory;

                self.edgeScore = results.edgeScore;
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    getCoordinate(country) {
        let latitude = Math.round(country.coordinate.latitude * 100) / 100;
        let longitude = Math.round(country.coordinate.longitude * 100) / 100;

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

    getPop(country) {
        let c = 0;
        let u = "";

        let m = country.population / 1000000;

        if (m > 1000) {
            // billions
            let b = country.population / 1000000000;
            c = Math.round(b * 100) / 100;
            u = "B";
        } else {
            // millions
            c = Math.round(m * 100) / 100;
            u = "M";
        }

        return `${c} ${u}`;
    }

    getSectorsDataset() {
        let data = [];
        let labels = [];
        let backgroundColors = [];

        let index = 0;
        if (this.edgeScore !== null) {
            this.edgeScore.sectorRepartition.forEach(function(s) {
                data.push(s.proportion);
                labels.push(s.name);


                backgroundColors.push(COLORS[index]);

                index += 1;
            })
        }

        return {
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                label: 'Sector repartition'
            }],
            labels: labels,
        }
    }

    getEdgeHistoryDataset() {
        let self = this;

        let data = [];
        this.edgeHistory.forEach(function(e) {
            let arrow = '<-';
            if (e._from === self.countryA.id) {
                arrow = '->'
            }

            let subjectButton =
                html(`<a target="_blank" href="${e.article_link}">${e.subject}</a>`);

            let sectorBadge =
                html(`<span class="badge badge-primary">${e.sector}</span>`);

            let updatedAt = new Date(e.date).toLocaleDateString();

            let impact = "+";
            if (e.impact < 0) {
                impact = "-"
            }
            for (let i = 1; i < e.impact; i++) {
                impact += impact;
            }

            data.push([
                subjectButton,
                e.brief,
                sectorBadge,
                updatedAt,
                impact,
                arrow,
            ]);
        });

        this.edgeHistoryDataset = {
            cols: ['subject', 'brief', 'sector', 'date', '+/-', '<->'],
            rows: data,
            styles: {
                table: {
                    border: 'solid 1px white'
                },
                th: {
                    backgroundColor: 'black'
                },
                td: {
                    backgroundColor: 'black'
                },
                footer: {
                    backgroundColor: 'black',
                }
            }
        }
    }

    getScoreHistoryDataset(timeFormat) {
        function compareEdgeTime(a, b) {
            let aDate = new Date(a.date);
            let bDate =new Date(b.date);
            if (aDate < bDate) {
                return -1
            } else if (aDate > bDate) {
                return 1
            }

            return 0;
        }

        let edgesHist = this.edgeHistory.slice();
        edgesHist.sort(compareEdgeTime);

        let sum = 0;
        let data = [];
        let labels = [];
        edgesHist.forEach(function(e) {
            let date = moment(e.date).toDate();
            let dateString = moment(e.date).format(timeFormat);

            sum += e.impact;
            data.push({
                x: dateString,
                y: sum
            });
            labels.push(date)
        });

        return {
            labels: labels,
            datasets: [{
                label: 'Score',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };
    }

    getInitDataset() {
        let self = this;

        let AtoB = 0;

        if (this.edgeHistory != null) {
            this.edgeHistory.forEach(function(e) {
                if (e._from === self.countryA.id) {
                    AtoB += 1;
                }
            })
        }


        let AtoBPercent = AtoB * 100 / this.edgeHistory.length;
        let BtoAPercent = 100 - AtoBPercent;

        return {
            datasets: [{
                data: [AtoBPercent, BtoAPercent],
                backgroundColor: [COLORS[3], COLORS[4]],
                label: 'Country initiation'
            }],
            labels: [
                self.countryA.key,
                self.countryB.key,
            ]
        }
    }
}