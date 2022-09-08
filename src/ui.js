console.log("---- ui.js loaded ----")
function getActor() {
    const actorD = canvas?.tokens?.controlled[0]?.actor || game.user.character || token.actor;
    return actorD;
}



export {
    getActor
}