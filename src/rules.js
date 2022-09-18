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

export {convertShiftsToOutcome}