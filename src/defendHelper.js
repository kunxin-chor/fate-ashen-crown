import ConflictHelperDialog from "./conflictHelper.js";
import { getOneSkillFromActor, getItems } from './character.js';
import { createRollMessage, roll } from './actions.js';
import { convertShiftsToOutcome, getEffectFromShifts } from './rules.js';
import { renderSkillSelect } from './ui.js';


class DefendHelperDialog extends ConflictHelperDialog {
    createContent = () => {

        let html = `
        <div>
            <div class="conflict-helper-dialog">                
                <div style="flex:1;padding:10px;">
                    ${renderSkillSelect("Approach", this.actor, "approach", "approach")}
                </div>
                <div style="flex:1;padding:10px;">
                    ${renderSkillSelect("Combat Aptitude", this.actor, "combat", "combat", "aptitude")}
                </div>     
                <div style="flex:1;padding:10px">                   
                    ${this.renderModifiers()}                   
                </div>      
                <div style="flex:1;padding:10px">  
                    <h3>Equipments</h3>
                    ${this.renderEquipmentSelect()}
                </div>
            </div>         
             ${this.renderSplitShifts()}   
         
        </div>
        `;
        return html;
    }

    getSelectedOptions = () => {

        let approach = document.querySelector('.select-approach:checked').value;
        let skill = document.querySelector('.select-combat:checked').value;
        if (skill == 'others') {
            skill = document.querySelector('#select-skill-others').value
        }
        // get the position
        let position = document.querySelector('.position-select:checked').value;

        // get the modifiers
        let rollModifier = document.querySelector('#roll-modifier').value;
        let effectModifier = document.querySelector('#effect-modifier').value;

        // get the armor
        let selectedArmor = document.querySelector('#armor-select').value;
        let armor = getItems(this.actor, 'armor').find(a => a.id == selectedArmor);
        if (!armor) {
            armor = {
                "armor": "none",
                "damage_reduction": 0,
            }
        } else {
            // add default values
            armor.damage_reduction = armor.damage_reduction || 0;
        }

        // get the shield
        let selectedShield = document.querySelector('#shield-select').value;
        let shield = getItems(this.actor, 'shield').find(s => s.id == selectedShield);
        if (!shield) {
            shield = {
                "shieid": "none",
                "parry":0,
                "damage_reduction":0
            }
        } else {
            // add default values
            shield.damage_reduction = shield.damage_reduction || 0;
            shield.parry = shield.parry || 0;
        }



        return { approach, skill, position, rollModifier, effectModifier, armor, shield };
    }

    renderEquipmentSelect = () => {
        let html = `<div class="flexrow" style="margin:5px">
        <label class="flex1">Armor</label>
        <select class="flex1" id="armor-select">`;
        let armors = getItems(this.actor, 'armor');
        // None option
        html += `<option value="">None</option>`;
        let first = true;
        for (let a of armors) {
            html += `<option value="${a.id}" ${first ? 'selected' : ''}>${a.name}</option>`;
            first = false;
        }
        html += `</select></div>`;

        // select shield
        html += `<div class="flexrow" style="margin:5px">
        <label class="flex1">Shield</label>
        <select class="flex1" id="shield-select">`;
        let shields = getItems(this.actor, 'shield');
        // None option
        html += `<option value="">None</option>`;
        first = true;
        for (let s of shields) {
            html += `<option value="${s.id}" ${first ? 'selected' : ''}>${s.name}</option>`;
            first = false;
        }
        html += `</select></div>`;

        return html;
    }
}

const createDefendCommand = (params) => {
    console.log("params=>", params);
    
    return {
        id: 'defend',
        label: "Defend",
        callback: async (actor, selectedOptions) => {
            console.log("selectedOptions=>",selectedOptions);

            const extraMessages = [];

            const message = createRollMessage("Defend");
            const approach = getOneSkillFromActor(actor, selectedOptions.approach);
            const skill = getOneSkillFromActor(actor, selectedOptions.skill);
            const modifier = 0;
            const [rollData, chatMessage] = await roll(actor,
                approach.rank,
                skill.rank,
                modifier,
                message);
            // determine outcome
            const total = rollData.total;

            if (selectedOptions.shield.shield != "none") {
                extraMessages.push("Shield reduced Attacker's shifts by: " + selectedOptions.shield.parry);
            }

            const shifts = params.targetNumber - total - selectedOptions.shield.parry;
            const results = convertShiftsToOutcome(shifts);
            let effects = getEffectFromShifts(shifts) 
                + parseInt(params.weapon.harm);

            // check if defender is blocking and has blocked successfully
            if (selectedOptions.shield.shield != "none" && shifts <=0) { 
                effects -= selectedOptions.shield.damage_reduction; 
                extraMessages.push("Shield blocked the attack and reduced harm by" + selectedOptions.shield.damage_reduction);
            } else {
                effects -= selectedOptions.armor.damage_reduction;
                extraMessages.push("Armor reduced harm by " + selectedOptions.armor.damage_reduction);
            }      
   

            // send this back
            if (effects > 0) {
                effects += params.effectModifier;
            }
            console.log(extraMessages);
            await chatMessage.update({
                flavor: chatMessage.flavor +
                    ` ${extraMessages.map(s => `<div>${s}<div>`).join("")}
                      <div>Result: ${total} vs ${params.targetNumber}</div>
                      <div>Attacker's Shifts: ${shifts}</div>
                      <div>Attacker's Result: ${results}<div>
                      <div>Attacker's Effect: ${effects}</div>
                    `
            })

            // update the original chat message
            const element = document.createElement('div');
            element.innerHTML = params.originChatMessage.flavor;
            element.querySelector(`#${params.rollId}`).innerHTML = `<br/>Result: ${shifts} (${results}) Effect: ${effects}`;

            await params.originChatMessage.update({
                flavor: element.outerHTML
            })

        }
    }

}

const createDefenderHelper = (actor, params) => {
    const defendHelper = new DefendHelperDialog("Defend Helper", actor, [createDefendCommand(params)]);
    return defendHelper;
}

export { DefendHelperDialog, createDefenderHelper }