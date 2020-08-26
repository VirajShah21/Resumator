const AllInput = {
    /**
     * A mapper of validator name to the validator function
     */
    validators: {
        /**
         * Validates an email with the format <user>@<domain>.<tld>
         *
         * @param {string} email The email to validate
         * @returns {boolean} True if the email is valid
         */
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

        /**
         * Checks if a password is at least 8 characters long
         *
         * @param {string} password The password to validate
         * @returns {boolean} True if the password is valid, false otherwise
         */
        password: function (password) {
            return password.length > 8;
        },

        /**
         * Checks if a phone number follows the format (XXX) XXX - XXXX
         *
         * @param {string} phone The phone number to validate
         * @returns {boolan} True if the phone number is valid, false otherwise
         */
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

        /**
         * @param {string} text Anything literally
         * @returns True if text is not blank
         */
        text: function (text) {
            return text.trim().length > 0;
        },

        /**
         * Checks if a date string follows the format: mm/dd/YYYY
         *
         * @param {string} date The date to validate
         * @returns True if the date is valid; false otherwise
         */
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

        /**
         * Checks if the zip code is a 5 digit number
         *
         * @param {string} zip The zip code
         */
        zip: function (zip) {
            return zip.length == 5;
        },

        /**
         * Checks if a month-year datestring follows the format: mm/YYYY
         *
         * @param {string} monthYear The month-year date string
         */
        mmyyyy: function (monthYear) {
            try {
                let month = parseInt(monthYear.split("/")[0]);
                let year = parseInt(monthYear.split("/")[1]);

                return month > 0 && month <= 12 && year >= 1000 && year <= 9999;
            } catch (e) {
                return false;
            }
        },
    },

    /**
     * A mapper of formatter names and formatter functions
     */
    formatters: {
        /**
         * Formats a phone number from XXXXXXXXXX to (XXX) XXX - XXXX
         *
         * @param {string} phone The phone number
         * @returns {string} The formatted phone number: (XXX) XXX - XXXX
         */
        phone: function (phone) {
            let digits = phone
                .split("")
                .filter((digit) => {
                    return "1234567890".indexOf(digit) >= 0;
                })
                .join("");
            return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)} - ${digits.substring(6, 10)}`;
        },

        /**
         * Formats a month-year datestring from mmYYYY to mm/YYYY
         *
         * @param {string} monthYear The month-year datestring
         * @returns {string} The formatted datestring: mm/YYYY
         */
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
    },

    /**
     * Removes validator decorations from an input element
     *
     * @param {HTMLInputElement} input The input element to clear validation for
     */
    clearValidation: function (input) {
        let classes = input.className;
        classes = classes.replace("is-valid", "");
        classes = classes.replace("is-invalid", "");
        while (classes.indexOf("  ") >= 0) {
            // remove double spaces
            classes = classes.replace("  ", " ");
        }
        input.className = classes;
    },

    /**
     * Inserts successful validation decorators in an input element
     *
     * @param {HTMLInputElement} input The input element to notify
     */
    notifyValid: function (input) {
        clearValidation(input);
        input.className += " is-valid";
    },

    /**
     * Inserts failed validation decorators in an input element
     *
     * @param {HTMLInputElement} input The input element to notify
     */
    notifyInvalid: function (input) {
        clearValidation(input);
        input.className += " is-invalid";
    },

    /**
     * Initializes a passive validator and formatter for all
     * elements with the "data-type" or
     * "data-validate"/"data-format" attribute
     */
    initializePassiveValidator: function () {
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

                    if (target.value.trim().length > 0 && formatter)
                        target.value = AllInput.formatters[formatter](target.value);
                });
            }
        });
    },
};
