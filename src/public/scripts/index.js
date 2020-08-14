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

    phone: function (phone) {
        return (
            phone.split("").filter((digit) => {
                try {
                    parseInt(digit);
                    return true;
                } catch (e) {
                    return false;
                }
            }).length == 16
        );
    },

    text: function (text) {
        return text.trim().length > 0;
    },

    date: function (date) {
        try {
            let month = parseInt(date.split("/")[0]);
            let day = parseInt(date.split("/")[1]);
            let year = date.split("/")[2];

            return month > 0 && month < 13 && day > 0 && day < 32 && year.length == 4;
        } catch (e) {
            return false;
        }
    },

    zip: function (zip) {
        return zip.length == 5;
    },

    mmyyyy: function (monthYear) {
        try {
            let month = parseInt(monthYear.split("/")[0]);
            let year = parseInt(monthYear.split("/")[1]);

            return month > 0 && month <= 12 && year >= 1000 && year <= 9999;
        } catch (e) {
            return false;
        }
    },
};

const formatters = {
    phone: function (phone) {
        let digits = phone
            .split("")
            .filter((digit) => {
                return "1234567890".indexOf(digit) >= 0;
            })
            .join("");
        return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)} - ${digits.substring(6, 10)}`;
    },

    mmyyyy: function (monthYear) {
        let digits = monthYear
            .split("")
            .filter((value) => {
                try {
                    return !isNaN(parseInt(value));
                } catch (e) {
                    return false;
                }
            })
            .map((value) => {
                return +value;
            })
            .join("");

        if (digits.length > 6 && digits.charAt(0) == 0 && digits.charAt(1) == 1) digits = digits.substring(1);
        else if (digits.length > 6) digits = digits.substring(0, digits.length - 1);

        if (
            (digits.length == 1 && digits.charAt(0) > 1) ||
            (digits.length == 2 && digits.charAt(0) > 2 && digits.charAt(0) != 0)
        )
            digits = "0" + digits;

        return digits.length >= 2 ? `${digits.substring(0, 2)}/${digits.substring(2)}` : digits;
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
            // Validate
            input.addEventListener("change", (event) => {
                let target = event.target;
                let validator = target.getAttribute("data-type") || target.type || "text";

                if (target.required && target.value.trim().length == 0) notifyInvalid(target);
                else if (!target.required && target.value.trim().length == 0) clearValidation(target);
                else if (validators.hasOwnProperty(validator))
                    validators[validator](target.value) ? notifyValid(target) : notifyInvalid(target);
            });
        }

        if (input.getAttribute("data-type") !== undefined || input.getAttribute("data-format") !== undefined) {
            // Format
            input.addEventListener("keyup", (event) => {
                let target = event.target;
                let formatter = target.getAttribute("data-type") || target.type;

                if (target.value.trim().length > 0 && formatter) target.value = formatters[formatter](target.value);
            });
        }
    });
}
