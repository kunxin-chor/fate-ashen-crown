/** Contain functionalities for working with characters **/

// debug
console.log("---- character.js loaded ------")

// given an actor, retrieve its skills
// this is prone to change thanks to Foundry changing its data format all the time
function getSkillsFromActor(actor) {
    return actor.data.data.skills;
}

/**
 * 
 * @param {*} actor The actor to get the skill from
 * @param {*} filter Which kind of skills to get 
 * @return [] An array of skills that matches the filter
 */
function getSkills(actor, filter) {
    // get all skills if filter is "*" or undefined

    let filtered = [];

    for (const [skillName, value] of Object.entries(getSkillsFromActor(actor))) {  

        // if filter is *, we get all the skills
        // if it is an array, then we check if the skill name is included
        // if it begins with a !, then check if the skill does not being with [<filter>]
        // otherwise we check if the skillname has [<filter>]
        if (!filter || filter=="*") {
            filtered.push(value)            
        } else if (Array.isArray(filter) && filter.includes(skillName)) {
            filtered.push(value);
        } else if (skillName.toLowerCase().startsWith(`[${filter.toLowerCase()}]`)) {
            filtered.push(value);
        } else if (filter.startsWith('!') && !skillName.toLowerCase().startsWith(`[${filter.toLowerCase().slice(1)}]`)) {
            filtered.push(value);
        } 
    } 

    filtered.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (b.name > a.name) {
            return -1;
        } else {
            return 0;
        }
    });

    return filtered;
}

function getOneSkillFromActor(actor, skillName) {
    return actor.data.data.skills[skillName]
}

export {
    getSkills, getOneSkillFromActor
}