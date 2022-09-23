import { getTargets, renderSkillSelect } from "./ui.js"
import { getOneSkillFromActor, getItems } from './character.js'
import { roll } from './actions.js'

class ConflictHelperDialog {
    constructor(title, actor, commands = []) {
        this.title = title;
        this.actor = actor;
        this.commands = commands;
        this.possibleActions = ["Attack", "Create An Advantage", "Defend", "Overcome"];
    }

    createContent = () => {

        let html = `
        <div>
            <div class="conflict-helper-dialog">
                <div style="flex:1;padding:10px;">
                    ${this.renderActionSelect()}
                </div>            
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

    renderActionSelect = () => {
        let html = `<h3>Action</h3>`;
        for (let c of this.possibleActions) {
            html += `<div><input type="radio" class="select-radio-button" id="select-action-${c}" name="action" value="${c}">
            <label for="select-action-${c}">${c}</label></div>`
        }

        return html;
    }

    renderEquipmentSelect = () => {
        let html = `<div class="flexrow" style="margin:5px">
        <label class="flex1">Weapon</label>
        <select class="flex1" id="equipment-select">`;
        let weapons = getItems(this.actor, 'weapon');
        // None option
        html += `<option value="">None</option>`;
        let first = true;
        for (let weapon of weapons) {
            html += `<option value="${weapon.id}" ${first == true ? "selected" : ""}>${weapon.name}</option>`
            first = false;
        }
        html += `</select></div>`;
        return html;
    }

    renderSplitShifts() {
        if (getTargets().size > 1) {
            return `
                <div style="display:flex">
                    <input type="checkbox" id="split-shifts"/>
                    <label style="margin-top:5px">Split Shifts</label>
                </div>
                `
        } else {
            return ""
        }
    }

    renderModifiers(more = "") {
        return `<div>
        <h3>Modifiers</h3>
            <div style="margin:5px" class="flexrow">
                <h4 class="flex2">Position</h4>
                <div class="flex3">
                    <div>
                        <input id="position-desperate" type="radio" class="position-select" name="position" value="desperate"/>
                        <label>Desperate</label>             
                    </div>
                    <div>
                        <input id="position-risky" type="radio" name="position" class="position-select" value="risky" checked/>
                        <label>Risky</label>
                    </div>
                    <div>
                        <input id="position-controlled" type="radio" name="position" class="position-select" value="controlled"/>
                        <label>Controlled</label>
                    </div>
                </div>
            </div>
            <div class="flexrow" style="margin:5px">
                <label class="flex1">Roll Modifier</label>
                <input class="flex1" type="number" id="roll-modifier" value="0"/>
            </div>    
            <div class="flexrow" style="margin:5px">
                <label class="flex1">Effect Modifier</label>
                <input class="flex1" type="number" id="effect-modifier" value="0"/>
            </div>

            ${more}
            </div>
        `

    }

    getSelectedOptions = () => {
        let action = document.querySelector('input[name="action"]:checked').value;
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

        // get the weapon
        let selectedWeapon = document.querySelector('#equipment-select').value;
        let weapon = getItems(this.actor, 'weapon').find(w => w.id == selectedWeapon);
        if (!weapon) {
            weapon = {
                "weapon": "none",
                "harm": -1,
                "attack_modifier": 0,
                "armor_reduction": 0,
                "armor_piercing": 0
            }
        } else {
            // add default values
            weapon.harm = weapon.harm || 0;
            weapon.attack_modifier = weapon.attack_modifier || 0;
            weapon.armor_piercing = weapon.armor_piercing || 0;
            weapon.armor_reduction = weapon.armor_reduction || 0;
            weapon.attack_modifier = weapon.attack_modifier || 0;
        }

        return { approach, skill, position, rollModifier, effectModifier, weapon, action };
    }

    executeRoll(commandCallback) {
        const selectedOptions = this.getSelectedOptions();
        commandCallback(this.actor, selectedOptions);
    }

    handleDialogRender = (html) => {
         // disable the attack button 
         html.find('.dialog-button.attack').prop('disabled', true);

         // enable the attack button if an action, approach and skill is selected
         html.find('.select-radio-button').change(() => {
             let action = html.find('input[name="action"]:checked').val();
             let approach = html.find('.select-approach:checked').val();
             let skill = html.find('.select-combat:checked').val();
             if (action && approach && skill) {
                 html.find('.dialog-button.attack').prop('disabled', false);
             } else {
                 html.find('.dialog-button.attack').prop('disabled', true);
             }
         });  
    }

    render = () => {
        let content = this.createContent();

        const buttons = {};
        for (let command of this.commands) {
            buttons[command.id] = {
                label: command.label,
                callback: () => {
                    this.executeRoll(command.callback);
                }
            }
        }

        buttons.cancel = {
            label: "Cancel",
            callback: () => { }
        }


        let dialog = new Dialog({
            title: this.title,
            content: content,
            buttons: buttons,
            render: this.handleDialogRender
        }, {
            'width': 980
        });
        dialog.render(true);
    }
}

export default ConflictHelperDialog;