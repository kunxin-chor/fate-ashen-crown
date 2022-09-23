import {getSkills} from './character.js';
import {formatModifier, removeSkillCategory} from './stringHelpers.js';

console.log("---- ui.js loaded ----")


function getActor() {
    const actorD = canvas?.tokens?.controlled[0]?.actor || game.user.character || token.actor;
    return actorD;
}

function getTargets() {
    return game.user.targets;
}

function renderSkillSelect(title, actor, filter, id, others="") {
    const skills = getSkills(actor, filter);
    let index = 0;
    let html = `<h3>${title}</h3>`;
    for (let skill of skills) {
        html += `<div class="skill-select-radio-button">
                    <input type="radio" 
                        id="select-${id}-${index}"
                        class="select-${id} select-radio-button" 
                        name="${id}" 
                        value="${skill.name}"             
                    /><label for="select-${id}-${index}">${removeSkillCategory(skill.name)} (${formatModifier(skill.rank)})</label>
                 </div>`
        index++;
    }

    if (others) {
        const otherSkills= getSkills(actor, others);
        html += `<div class="skill-select-radio-button">
            <input type="radio"
                id="select-${id}-${index+1}"
                class="select-${id}-others"
                name="${id}"
                value="others"
            />
            <label for="select-${id}-${index+1}">Others</label>
            ${renderSelectSkillDropdown(otherSkills, "others")}
        </div>
        `
    }

    return html;
}

function renderSelectSkillDropdown(skills, id) {
    let html = `<select id="select-skill-${id}">`;
    for (let skill of skills) {        
        html += `<option value="${skill.name}">${removeSkillCategory(skill.name)} (${formatModifier(skill.rank)})</option>`
    }
    html += `</select>`;
    return html;
}

async function updateChatMessage(chatMessage) {
    await ui.chat.updateMessage(chatMessage);

}


export {
    getActor, renderSkillSelect, getTargets, updateChatMessage
}