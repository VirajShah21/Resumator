const validators = {
    email: function (email) {
        try {
            const user = email.split("@")[0].trim();
            const domain = email.split("@")[1].trim();
            const domainName = domain.split(".")[0].trim();
            const tld = domain.split(".")[1].trim();

            return user.length > 0 && domain.length > 0 && domainName.length > 0 && tld.length > 1;
        } catch (e) {
            return false;
        }
    },

    password: function (password) {
        return password.length > 8;
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
        if (input.getAttribute("data-type") !== undefined || input.getAttribute("data-validate") !== undefined) {
            console.log("Validating " + input);
            input.addEventListener("change", (event) => {
                let target = event.target;
                let validator = target.getAttribute("data-type") || target.type;
                if (target.required && target.value.trim().length == 0) notifyInvalid(target);
                else if (!target.required && target.value.trim().length == 0) clearValidation(target);
                else if (validators.hasOwnProperty(validator))
                    validators[validator](target.value) ? notifyValid(target) : notifyInvalid(target);
            });
        }
    });
}
