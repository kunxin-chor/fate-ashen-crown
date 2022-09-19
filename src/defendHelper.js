import ConflictHelperDialog from "./conflictHelper.js";
import { getOneSkillFromActor } from './character.js';
import { createRollMessage, roll } from './actions.js';
import { convertShiftsToOutcome, getEffectFromShifts } from './rules.js';


class DefendHelperDialog extends ConflictHelperDialog {

}

const createDefendCommand = (params) => {
    console.log(params);
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
            const shifts = params.targetNumber - total;
            const results = convertShiftsToOutcome(shifts);
            let effects = getEffectFromShifts(shifts);
            // send this back

            if (effects >0) {
                effects += params.effectModifier;
            }

            await chatMessage.update({
                flavor: chatMessage.flavor +
                    ` <div>Result: ${total} vs ${params.targetNumber}</div>
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