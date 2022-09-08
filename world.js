import {getSkills} from './src/character.js';
import {getActor} from './src/ui.js';
import {twoColumnRoll} from './src/twoColumnRoll.js';
import {EffortCalculator} from './src/effortCalculator.js';

console.log("----Fateful: World.js------")

const createEffortCalculator = async function() {
   
    const response = await fetch(`worlds/${game.world.id}/src/data/feat-chart.json`);
    const json = await response.json();
    return new EffortCalculator(json);
}

// register those in global scope so that those can be used in marco
window.Fateful = {
    getSkills, getActor, twoColumnRoll, createEffortCalculator
}

