

/**
 * Make a roll
 * @param {*} actor The actor initiating the roll
 * @param {*} rank 
 * @param {*} modifier 
 * @param {*} message The message to attach to the chart card
 */
async function roll(actor, rank, modifier, message) {
    let r = new Roll(`4dF+${rank}+${modifier}`)
    
    // roll the dice
    let roll = await r.roll();
    roll.dice[0].options.sfx = { id: "fate4df", result: roll.result };

    // create chat message
    let msg = ChatMessage.getSpeaker(actor);
    msg.alias = actor.name;

    // send the message
    await roll.toMessage({
        'flavor': message,
        'speaker': msg,

    },{
        'create': true
    })

}
export { roll };