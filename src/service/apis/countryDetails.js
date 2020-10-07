import {html} from "gridjs";

const axios = require('axios').default;
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

export default class countryDetails {
    constructor(headers, host) {
        this.service = axios.create({
            headers: headers,
            baseURL: host,
        });

        this.routes = {
            countriesDetails: "/countries/details",
        };

        this.country = null;
        this.relationships = [];
        this.organisations = [];
        this.relationListDataset = null;
    }

    getCountriesDetails(countryKey) {
        let self = this;

        return this.service.get(this.routes.countriesDetails, {
            params: {
                country: countryKey
            }
        })
            .then(function(response) {
                let c = response.data.Content;
                self.country = c.country;
                self.relationships = c.relationships;

                self.setRelationListDataset();

                return c
            })
            .catch(function(error) {
                if (error.response) {
                    throw error.response.data.Message
                } else {
                    throw error
                }
            })
    }

    getInitDataset() {
        let self = this;

        let countryInitiator = 0;
        this.relationships.forEach(function(e) {
            if (e._from === self.country.id) {
                countryInitiator += 1;
            }
        });

        let countryInitiatorPercent = countryInitiator * 100 / this.relationships.length;
        let otherInitiatorPercent = 100 - countryInitiatorPercent;

        return {
            datasets: [{
                data: [countryInitiatorPercent, otherInitiatorPercent],
                backgroundColor: [COLORS[3], COLORS[4]],
                label: 'Country initiation'
            }],
            labels: [
                self.country.key,
                "others"
            ]
        }



    }

    getImpactHistoryDataset(timeFormat) {
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

        let relHist = this.relationships.slice();
        relHist.sort(compareEdgeTime);

        let sum = 0;
        let data = [];
        let labels = [];
        relHist.forEach(function(e) {
            let date = moment(e.date).toDate();
            let dateString = moment(e.date).format(timeFormat);

            sum += e.impact;
            data.push({
                x: dateString,
                y: sum
            });
            labels.push(date);
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
        }
    }

    getSectorRepartitionDataset() {
        let sectors = [];
        this.relationships.forEach(function(e) {
            let currentSector = e.sector;
            let alreadyIn = false;
            sectors.forEach(function(s) {
                if (s.name === currentSector) {
                    alreadyIn = true;
                    s.count += 1;
                }
            });

            if (alreadyIn === false) {
                sectors.push({
                    name: currentSector,
                    count: 1,
                })
            }
        });

        let data = [];
        let labels = [];
        let backgroundColors = [];

        let index = 0;
        sectors.forEach(function(s) {
            data.push(s.count);
            labels.push(s.name);
            backgroundColors.push(COLORS[index]);

            index += 1;
        });

        return {
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                label: 'Sector repartition'
            }],
            labels: labels,
        }
    }

    setRelationListDataset() {
        let data = [];
        this.relationships.forEach(function(e) {
            let subjectButton = html(`<a target="_blank" href="${e.article_link}">${e.subject}</a>`);

            let sectorBadge = html(`<span class="badge badge-primary">${e.sector}</span>`);

            let date = new Date(e.date).toLocaleDateString();

            let maxLengthBrief = 60;
            let brief = e.brief;
            if (brief.length > 30) {
                brief = brief.slice(0, maxLengthBrief) + "...";
            }

            data.push([
                subjectButton,
                brief,
                sectorBadge,
                date
            ])
        });

        let cols = ["subject", "brief", "sector", "date"];
        let style = {
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
        };

        this.relationListDataset = {
            cols: cols,
            rows: data,
            styles: style
        }
    }

    countryCoordinates() {
        let latitude = Math.round(this.country.coordinate.latitude * 100) / 100;
        let longitude = Math.round(this.country.coordinate.longitude * 100) / 100;

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

    countryPop() {
        let c = 0;
        let u = "";

        if (this.country !== null) {
            let m = this.country.population / 1000000;

            if (m > 1000) {
                // billions
                let b = this.country.population / 1000000000;
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

}

