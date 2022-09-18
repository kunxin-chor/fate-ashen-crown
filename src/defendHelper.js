import ConflictHelperDialog from "./conflictHelper.js";
import { getOneSkillFromActor } from './character.js';
import { createRollMessage, roll } from './actions.js';
import { convertShiftsToOutcome } from './rules.js';

class DefendHelperDialog extends ConflictHelperDialog {

}

const createDefendCommand = (params) => {
    return {
        id: 'defend',
        label: "Defend",
        callback: async (actor, selectedOptions) => {
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
            const shifts = total - params.targetNumber;
            const results = convertShiftsToOutcome(shifts);
            // send this back


            await chatMessage.update({
                flavor: chatMessage.flavor +
                    ` <div>Defend Result: ${total} vs ${params.targetNumber}</div>
                      <div>Shifts: ${shifts}</div>
                      <div>Result: ${results}<div>
                    `
            })

            // update the original chat message
            const element = document.createElement('div');
            element.innerHTML = params.originChatMessage.flavor;
            element.querySelector(`#${params.rollId}`).innerHTML = `Defend Result: ${shifts} (${results}) `;
            
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