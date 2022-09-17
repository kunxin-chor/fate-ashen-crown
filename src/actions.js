

/**
 * Make a roll
 * @param {*} actor The actor initiating the roll
 * @param {*} rank 
 * @param {*} modifier 
 * @param {*} message The message to attach to the chart card
 */
async function roll(actor, approach, skill, modifier, message) {
    let r = new Roll(`4dF+${approach}+${skill}+${modifier}`)

    // roll the dice
    let roll = await r.roll();
    roll.dice[0].options.sfx = { id: "fate4df", result: roll.result };

    // create chat message
    let msg = ChatMessage.getSpeaker(actor);
    msg.alias = actor.name;

    // send the message
    const chatMessage = await roll.toMessage({
        'flavor': message,
        'speaker': msg,

    }, {
        'create': true
    })

    return [roll, chatMessage];
}

function createRollMessage(actionName, extraFlavor="") {
    let message = `
    <h1>${actionName}</h1>
    <div>${game.i18n.localize("fate-core-official.RolledBy")}: ${game.user.name}</div>
    <div>${extraFlavor}</div>`
    return message;
}

export { roll, createRollMessage };