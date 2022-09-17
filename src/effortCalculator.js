console.log("---EffortCalculator.js loaded---")

class EffortCalculator {
    maxRanks = 7;
    selected = {
        numberOfTargets: { display: '1', rank: 0 },
        impact: { display: 'Limited', rank: 0 },
        duration: { display: 'Instant', rank: 0 },
        range: { display: 'Nearby', rank: 0 },
        harm: { display: '0', rank: 0 },
        harmModifier: { display: '+0', rank: 0 },
        areaOfEffect: { display: 'Single Target', rank: 0 },
        scale: { display: 'Mortal', rank: 0 },
        aspects: { display:'N/A', rank:0}


    };
    stuntRank = 0;
    rollRequired = 0;
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
        },
        {
            reference:"harmModifier",
            label:"Harm Modifier"
        },
        {
            reference: "scale",
            label: "Scale"
        },
        {
            reference: "aspects",
            label: "Aspects"
        }
    ]
    constructor(chartData) {
        this.chartData = chartData;
    }

    calculateTotalRanks = () => {
        let total = 0;
        for (let s in this.selected) {
            total += this.selected[s].rank;
        }

        // get the casting rank
        total = total - this.stuntRank;

        if (this.rollRequired == 1) {
            total -= 1;
        }

        return total;
    }

    createContent = () => {

        let html = `<div id="effort-calculator-dialog">            
            <table style="width:1000px" id="effort-calculator">
        `;

        // display column headers
        let headers = "<thead><tr><th>Rank</th>";
        for (let col of this.cols) {
            headers += `<th>${col.label}</th>`;
        }

        headers += "</tr></thead>";
        html += headers;

        for (let rank = -2; rank < this.maxRanks + 1; rank++) {
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

        html += `</table>
                <div id="results">     
                    <h2>Options</h2>             
                    <div>
                    ${this.renderStuntSelect()}
                    </div>
                    <div>
                    ${this.renderRolLRequired()}
                    </div>
                    Total Rank: <span id="total-rank">${this.calculateTotalRanks()}</span>                
                </div>
            </div>
        `;
        return html;
    }

    renderStuntSelect() {
        return `
        <label>Stunt Rank</label>
        <select id="stunt-rank">
            <option value="0" ${this.stuntRank == 0 ? 'selected' : ''}>None</option>
            <option value="1"  ${this.stuntRank == 1 ? 'selected' : ''}>Adventurer</option>
            <option value="3"  ${this.stuntRank == 3 ? 'selected' : ''}>Veteran</option>
            <option value="6"  ${this.stuntRank == 6 ? 'selected' : ''}>Champion</option>
        </select>
        `
    }

    renderRolLRequired() {
        return `
        <label>Roll Required</label>
        <input type="radio" id="roll-required" name="roll-required" value="true" ${this.rollRequired == 1 ? 'checked' : ''}>
        <label for="roll-required">Yes</label>
        <input type="radio" id="roll-required" name="roll-required" value="false" ${this.rollRequired == 0 ? 'checked' : ''}>
        <label for="roll-required">No</label>
        `
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
            'render': () => {
                $('#effort-calculator-dialog').on('click', '.effort-calculator-col', (e) => {
                    // use .attr instead of .data to prevent
                    // auto conversion of numbers to strings
                    let display = $(e.target).attr('data-display');
                    let rank = $(e.target).data('rank');
                    let property = $(e.target).data('property');

                    this.selected[property] = { display, rank };


                    // re-render the table
                    let content = this.createContent();
                    $('#effort-calculator-dialog').html(content);

                });

                $("#effort-calculator-dialog").on('change', '#stunt-rank', (e) => {
                    this.stuntRank = parseInt(e.target.value);
                    $('#total-rank').text(this.calculateTotalRanks());
                })

                $("#effort-calculator-dialog").on('change', 'input[name="roll-required"]', (e) => {
                    this.rollRequired = e.target.value == 'true' ? 1 : 0;
                    $('#total-rank').text(this.calculateTotalRanks());
                })
            }
        }, {
            width: '100%'
        }).render(true);
    }
}

export { EffortCalculator };