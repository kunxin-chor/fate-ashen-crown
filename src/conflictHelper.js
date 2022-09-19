import { getTargets, renderSkillSelect } from "./ui.js"
import { getOneSkillFromActor} from './character.js'
import { roll} from './actions.js'

class ConflictHelperDialog {
    constructor(title, actor, commands=[]) {
        this.title = title;
        this.actor = actor;
        this.commands = commands;
    }

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
            </div>         
             ${this.renderSplitShifts()}   
         
        </div>
        `;
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
        } else{
            return ""
        }
    }

    renderModifiers(more="") {
        return `<div>
        <h2>Modifiers</h2>
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

        return {approach,skill,position, rollModifier, effectModifier};
    }

    executeRoll(commandCallback) {
        const selectedOptions = this.getSelectedOptions();                   
        commandCallback(this.actor, selectedOptions);
    }  

    render = () => {
        let content = this.createContent();

        const buttons = {};
        for (let command of this.commands) {
            buttons[command.id] = {
                label: command.label,
                callback: ()=>{
                  this.executeRoll(command.callback);
                }
            }
        }

        buttons.cancel = {
            label: "Cancel",
            callback: () => {}
        }


        let dialog = new Dialog({
            title:this.title,
            content: content,          
            buttons: buttons
        }, {
            'width': '100%'
        });
        dialog.render(true);
    }
}

export default ConflictHelperDialog;