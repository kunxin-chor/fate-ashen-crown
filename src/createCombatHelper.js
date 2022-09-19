import ConflictHelperDialog from './conflictHelper.js';
import { getActor, getTargets } from './ui.js';
import { createRollMessage, roll } from './actions.js'
import { getOneSkillFromActor } from './character.js'

const attackCommand = {
    id: 'attack',
    label: "Attack",
    callback: async (actor, selectedOptions, targets = [], originalChatMessage = null, originalRoll = null, adjustModifier = 0) => {

        function getSettingString(token, chatMessage, targetNumber, effectModifier, rollId) {
            return JSON.stringify({
                'token': token.data._id,
                'chatMessageID': chatMessage._id,
                'targetNumber': targetNumber,
                'effectModifier': effectModifier,
                'rollId': rollId
            })
        }

        // create new roll or reuse an existing one
        let rollData = null;
        let chatMessage = null;
        if (originalRoll === null) {
            const message = createRollMessage("Attack");
            const approach = getOneSkillFromActor(actor, selectedOptions.approach);
            const skill = getOneSkillFromActor(actor, selectedOptions.skill);
            const rollModifier = selectedOptions.rollModifier;
           
            [rollData, chatMessage] = await roll(actor,
                approach.rank,
                skill.rank,
                rollModifier,
                message,
                originalChatMessage);
        } else {
            rollData = originalRoll;
            rollData.result = rollData.result = " + " + adjustModifier;
            rollData.total += adjustModifier;
            chatMessage = originalChatMessage;
            chatMessage.update({
                'rolls': [rollData]
            })
        }

        const total = rollData.total;

        // get all the targets if none is given
        if (targets.length === 0) {
            targets = getTargets();
        }

        // serialize the roll settings in case of a re-roll or a +2
        const rollSettings = {
            actorID: actor.data._id,
            action: "Attack",
            options: selectedOptions,
            targets: [...targets.map(t => t.data._id)],
            chatMessageID: chatMessage._id,
            total: total,
            rollData: rollData.toJSON(),
            effectModifier: selectedOptions.effectModifier
        }

  
        // check if there is split shifts
        let targetList = '<ul>';
        for (let t of targets) {
            const rollId = t.data._id + "-" + new Date().valueOf();
            targetList += `<li>
            <span class="pan-to-token" 
                data-token="${t.data._id}">${t.actor.data.name}</span>
                <button class="roll-defend action-buttons" 
                    style="width:auto;display:inline-block"
                    data-settings='${getSettingString(t, chatMessage, total, selectedOptions.effectModifier, rollId)}'>Roll Defence
                </button>
                <span id="${rollId}"></span>
            </li>`
        }
        targetList += '</ul>';

        // send this back
        await chatMessage.update({
            flavor: chatMessage.flavor +
                `   <div>
                        <div class="attack-result">Attack Result: ${total} </div>
                        <div style="display:flex">
                            <button class="reroll action-buttons" data-settings='${JSON.stringify(rollSettings)}'>Reroll</button>
                            <button class="adjust action-buttons" data-settings='${JSON.stringify(rollSettings)}'>Adjust Roll</button>
                        </div>
                    </div>
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

export { createCombatHelper, attackCommand };