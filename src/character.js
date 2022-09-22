/** Contain functionalities for working with characters **/
import {removeTags} from './stringHelpers.js';

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

function getItems(actor, type) {
    // look for extras with the `weapon: ` in permissions
    console.log(actor.items);
    let items = duplicate(actor.items);
   
    let processedItems = items
        .filter(i => {
            console.log(i);
            return i.system.permissions && removeTags(i.system.permissions).toLowerCase().startsWith(type)
        })
        .map(item => {

            let permission = removeTags(item.system.permissions);
            let rawProperties = permission.split(',');
            let propertyList = rawProperties.map(p => {
                let chunks = p.split(':').map(s => s.trim());
                return {
                    'name': chunks[0],
                    'value': chunks[1]
                }

            })

            let properties = {};
            for (let p of propertyList) {
                properties[p.name] = p.value;
            }

            properties.name = item.name;
            properties.id = item._id;
            return properties;

        })
    return processedItems;

}

export {
    getSkills, getOneSkillFromActor, getItems
}