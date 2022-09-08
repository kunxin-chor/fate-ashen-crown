import {getSkills} from './src/character.js'
import {getActor} from './src/ui.js'
import {twoColumnRoll} from './src/twoColumnRoll.js'


// register those in global scope so that those can be used in marco
window.Fateful = {
    getSkills, getActor, twoColumnRoll
}

