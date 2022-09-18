import ConflictHelperDialog from "./conflictHelper.js";

class DefendHelperDialog extends ConflictHelperDialog {

}

const defendCommand = {
    id: 'defend',
    label: "Defend",
    callback: async (actor, selectedOptions) => {
    }
}

const createDefenderHelper = (actor, params) => {
    const defendHelper = new DefendHelperDialog("Defend Helper", actor, [defendCommand]);
    return defendHelper;
}

export {DefendHelperDialog, createDefenderHelper}