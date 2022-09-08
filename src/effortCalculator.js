console.log("---EffortCalculator.js loaded---")

class EffortCalculator {
    maxRanks = 7;
    selected = {
        numberOfTargets: { display: '1', rank: 0 },
        impact: { display: 'Limited', rank: 0 },
        duration: { display: 'Instant', rank: 0 },
        range: { display: 'Nearby', rank: 0 },
        harm: { display: '0', rank: 0 },
        areaOfEffect: { display: 'Single Target', rank: 0 },

    };
    cols = [
        {
            reference: "numberOfTargets",
            label: "Number of Targets"
        },
        {
            reference: "impact",
            label: "Impact"
        },
        {
            reference: "range",
            label: "Range"
        },
        {
            reference: "areaOfEffect",
            label: "Area of Effect"
        },
        {
            reference: "duration",
            label: "Duration"
        },
        {
            reference: "harm",
            label: "Harm"
        }
    ]
    constructor(chartData) {
        this.chartData = chartData;
    }

    createContent = () => {

        let html = `<table style="width:800px" id="effort-calculator">`;

        // display column headers
        let headers = "<thead><tr><th>Rank</th>";
        for (let col of this.cols) {
            headers += `<th>${col.label}</th>`;
        }

        headers += "</tr></thead>";
        html += headers;

        for (let rank = -2; rank < this.maxRanks+1; rank++) {
            let row = "<tr>";

            // show the rank number
            row += `<td>${rank}</td>`;

            for (let col of this.cols) {
                let properties = this.chartData[col.reference];
                let property = properties.find(p => p.rank === rank);

              
                if (property?.rank == rank) {
              
                    row += `<td class="effort-calculator-col ${this.selected[col.reference]?.rank === property.rank ? 'selected' : ''}"
                        data-property="${col.reference}"
                        data-display="${property.display}"
                        data-rank="${property.rank}"
                        
                    ">
                        ${property.display}
                    </td>`;
                } else {
                    row += `<td></td>`;
                }
            }
            row += "</tr>";
            html += row;
        }
        html += "</table>";
        return html;
    }

    render() {
        new Dialog({
            'content': this.createContent(),
            'buttons': {
                'cancel': {
                    'label': 'Cancel',
                    'callback': function () {
                    }
                }
            },
            'render':  () => {
                $('#effort-calculator').on('click', '.effort-calculator-col', (e) => {
                    // use .attr instead of .data to prevent
                    // auto conversion of numbers to strings
                    let display = $(e.target).attr('data-display');            
                    let rank = $(e.target).data('rank');
                    let property = $(e.target).data('property');
              
               
                    this.selected[property] = { display, rank };      
                 

                    // re-render the table
                    let content = this.createContent();
                    $('#effort-calculator').html(content);

                });
            }
        }, {
            width: '100%'
        }).render(true);
    }
}

export { EffortCalculator };