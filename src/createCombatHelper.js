import ConflictHelperDialog from './conflictHelper.js';
import { getActor, getTargets } from './ui.js';
import { createRollMessage, roll } from './actions.js'
import { getOneSkillFromActor } from './character.js'




const attackCommand = {
    id: 'attack',
    label: "Attack",
    callback: async (actor, selectedOptions) => {

        function getSettingString(token, chatMessage, targetNumber) {
            return JSON.stringify({
                'token': token.data._id,     
                'chatMessageID': chatMessage._id,
                'targetNumber': targetNumber   
            })
        }

        const message = createRollMessage("Attack");
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
        
        // create target list
        const targets = getTargets();    

        // check if there is split shifts

        let targetList = '<ul>';
        for (let t of targets) {
            targetList += `<li>
            <span class="pan-to-token" 
                data-token="${t.data._id}">${t.actor.data.name}</span>
                <button class="roll-defend action-buttons" 
                    style="width:auto;display:inline-block"
                    data-settings='${getSettingString(t,chatMessage, total)}'>Roll Defence
                </button>
            </li>`
        }
        targetList += '</ul>';

        // send this back
       await chatMessage.update({
            flavor: chatMessage.flavor + 
                `
                    <div>Attack Result: ${total}</div>
                    <div>${targetList}</div>
                `
       })        
    }
}

const createCombatHelper = () => {
    const actor = getActor();
    const conflictHelper = new ConflictHelperDialog("Conflict Helper", actor, [attackCommand]);
    return conflictHelper;
}

export { createCombatHelper };