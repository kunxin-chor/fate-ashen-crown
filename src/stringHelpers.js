/**
 * Remove [<whatever] from a skill name
 */
function removeSkillCategory(skillName){
    let rightEndIndex = skillName.indexOf(']');
    return skillName.slice(rightEndIndex+1).trim();
}

function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '');
}

function formatModifier(modifier) {
    return parseInt(modifier) >= 0 ?  `+${modifier}` : `-${modifier}`;
}

export {
    removeSkillCategory, removeTags, formatModifier
}