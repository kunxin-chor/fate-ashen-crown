import { getOneSkillFromActor, getSkills } from './character.js';
import { getActor } from './ui.js';
import { removeSkillCategory } from './stringHelpers.js';
import {roll} from './actions';

console.log(' -- twoColumnRoll.js loaded ----')

function twoColumnRoll(leftFilter, rightFilter, leftLabel = "Left Column", rightLabel = "Right Column") {
    // 
    let actor = getActor();
    const left = getSkills(actor, leftFilter);
    const right = getSkills(actor, rightFilter);
    render(left, right, leftLabel, rightLabel);

    function render(leftColumnSkills, rightColumnSkills, leftLabel = "Left Column", rightLabel = "Right Column") {
        new Dialog({
            'content': `<h1>Make a Skill Roll</h1>
                <div style="display:flex; flex-direction: column">         
                    <div style="flex:1; display:flex; align-items:center; margin-bottom:10px">
                        <label style="flex:1">${leftLabel}</label>
                        <select style="flex:3" id="select-left-column">
                            ${leftColumnSkills.map(s => `<option value="${s.name}">${removeSkillCategory(s.name)} (rank: ${s.rank})</option>`)}
                        </select>
                    </div>
                    <div style="flex:1; display:flex; align-items:center; margin-bottom:10px">
                        <label style="flex:1">${rightLabel}</label>
                        <select style="flex:3" id="select-right-column>
                            ${rightColumnSkills.map(s => `<option value="${s.name}">${removeSkillCategory(s.name)} (rank: ${s.rank})</option>`)}
                        </select>
                   </div>                           
                   <div style="flex:1; display:flex; align-items:center; margin-bottom:10px">
                        <label style="flex:1">Modifier:</label>
                        <input type="number" style="flex:3" id="modifier" value="0" />                      
                    </div>                   
                </div>`,
            'buttons': {
                'overcome': {
                    'label': 'Overcome',
                    'callback': function () {
                        executeRoll("overcome")
                    }
                },
                'create_an_advantage': {
                    'label': 'Create an Advantage',
                    'callback': function () {
                        executeRoll("create_an_advantage")
                    }
                },
                'attack': {
                    'label': 'Attack',
                    'callback': function () {
                        executeRoll("attack")
                    }
                },
                'defend': {
                    'label': 'Defend',
                    'callback': function () {
                        executeRoll("defend")
                    }
                },
                'cancel': {
                    'label': 'Cancel',
                    'callback': function () {

                    }
                }
            }
        }, {
            'width': 600
        }).render(true)
    }

    function executeRoll(actionType) {
        let selectedLeft = document.querySelector('#select-left').value;
        let selectedRight = document.querySelector("#select-right").value;

        let rank = 0;
        let selectedLeftSkillInfo = {
            'name': 'None',
            'rank': 0
        }
        let selectedRightSkillInfo = getOneSkillFromActor(actor, selectedRight);
        if (selectedLeft) {
            selectedLeftSkillInfo = getOneSkillFromActor(actor, selectedLeft);
        }

        let rank = selectedLeftSkillInfo.rank + selectedRightSkillInfo.rank

        let modifier = parseInt(document.querySelector("#modifier").value);
        if (!modifier) {
            modifier = 0;
        }

        // build the roll message
        let actionFullName = null;
        switch (actionType) {
            case 'attack':
                actionFullName = 'Attack'
                break;
            case 'defend':
                actionFullName = 'Defend';
                break;
            case 'create_an_advantage':
                actionFullName = 'Create an Advantage';
                break;
            case 'overcome':
                actionFullName = 'Overcome'
                break;
        }

        let extraFlavor = `Attempts to ${actionFullName} with <span style="font-weight:bold">${removeSkillCategory(selectedLeftSkillInfo.name)}</span> (rank: ${selectedLeftSkillInfo.rank}) + <span style="font-weight:bold">
                           ${selectedRightSkillInfo.name}</span> (rank: ${selectedRightSkillInfo.rank})`
        if (modifier) {
            extraFlavor += " with modifier " + (modifier >= 0 ? '+' : '-') + modifier
        }

        let message = `<h1>${actionFullName}</h1>${game.i18n.localize("fate-core-official.RolledBy")}: ${game.user.name}<br>
        ${extraFlavor}
        <button class="show-action-help" data-action-type="${actionFullName}" style="margin-top:10px; margin-bottom:10px">Help</button>                      
        `;

        // make the roll
        roll(actor, rank, modiifer, message);

    }
}

export {
    twoColumnRoll
}