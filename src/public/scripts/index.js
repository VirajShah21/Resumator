function validateDatestring(datestr) {
    try {
        let month = parseInt(datestr.split("/")[0]);
        let day = parseInt(datestr.split("/")[1]);
        let year = parseInt(datestr.split("/")[2]);

        return month > 0 && month <= 12 && day > 0 && day <= 31 && year > 1800 && year < 2200;
    } catch (e) {
        return false;
    }
}

function validateZip(zip) {
    return zip.length <= 5;
}

const validators = {
    zip: function (zip) {
        return zip.length <= 5;
    },
};

function clearValidation(input) {
    let classes = input.className;
    classes = classes.replace("is-valid", "");
    classes = classes.replace("is-invalid", "");
    while (classes.indexOf("  ") >= 0) {
        // remove double spaces
        classes = classes.replace("  ", " ");
    }
    input.className = classes;
}

function notifyValid(input) {
    clearValidation(input);
    input.className += " is-valid";
}

function notifyInvalid(input) {
    clearValidation(input);
    input.className += " is-invalid";
}

function initializePassiveValidator() {
    document.querySelectorAll("input").forEach((input) => {
        if (
            input.getAttribute("data-type") !== undefined &&
            validators.hasOwnProperty(input.getAttribute("data-type"))
        ) {
            console.log("Validating " + input);
            input.addEventListener("change", (event) => {
                let target = event.target;
                let validator = target.getAttribute("data-type");
                if (target.required && target.trim().length == 0) notifyInvalid(target);
                else if (!target.required && target.value.trim().length == 0) clearValidation(target);
                else validators[validator](target.value) ? notifyValid(target) : notifyInvalid(target);
            });
        }
    });
}
