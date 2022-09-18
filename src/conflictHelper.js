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
                <div style="flex:1">
                    ${renderSkillSelect("Approach", this.actor, "approach", "approach")}
                </div>
                <div style="flex:1">
                    ${renderSkillSelect("Combat Aptitude", this.actor, "combat", "combat", "aptitude")}
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

    getSelectedOptions = () => {
        let approach = document.querySelector('.select-approach:checked').value;
        let skill = document.querySelector('.select-combat:checked').value;
        if (skill == 'others') {
            skill = document.querySelector('#select-skill-others').value
        }
        return {approach,skill};
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