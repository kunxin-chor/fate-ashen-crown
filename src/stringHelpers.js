/**
 * Remove [<whatever] from a skill name
 */
function removeSkillCategory(skillName){
    let rightEndIndex = skillName.indexOf(']');
    return skillName.slice(rightEndIndex+1);
}

export {
    removeSkillCategory,
}