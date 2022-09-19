function convertShiftsToOutcome(shifts) {
    if (shifts >=3) {
        return "Success with Style"
    } else if (shifts >=0) {
        return "Success"
    } else if (shifts >=-1) {
        return "Success at Cost"
    } else {
        return "Failure"
    }
}

function getEffectFromShifts(shifts) {
    if (shifts >=3) {
        return 2
    } else if (shifts >=0) {
        return 1
    } else {
        return 0;
    }
}

export {convertShiftsToOutcome, getEffectFromShifts}