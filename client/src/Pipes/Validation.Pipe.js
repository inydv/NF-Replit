/* eslint-disable no-useless-escape */
// CUSTOM IMPORT
import EnumConstant from "../Constants/Enum.Constant.json";

// FUNCTION VALIDATE FORM OR INPUT
export default function Validation(form, input, user) {
    let isError = false;
    let message = "";

    for (let i = 0; i < form.length; i++) {
        const { INPUT_TYPE, REQUIRED, LABEL, NAME, TYPE } = form[i];

        if (REQUIRED) {
            if (INPUT_TYPE === EnumConstant.FORM.SELECT_COMPANY && !input['company_id'] && user) {
                isError = true;
                message = "Please Select Company";
                break;
            } else if (INPUT_TYPE === EnumConstant.FORM.INPUT && TYPE === "email") {
                const EmailRegex =
                    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

                const IsValid = EmailRegex.test(input[NAME]);
                if (!IsValid) {
                    isError = true;
                    message = "EMAIL IS NOT VALID";
                    break;
                }

                // FURTHER CHECKING OF SOMETHINGS REGEX CAN'T HANDLE
                const Parts = input[NAME]?.split("@");
                if (Parts[0].length > 64) {
                    isError = true;
                    message = "EMAIL IS NOT VALID";
                    break;
                }

                const DomainParts = Parts[1].split(".");
                if (
                    DomainParts.some(function (Part) {
                        return Part.length > 63;
                    })
                ) {
                    isError = true;
                    message = "EMAIL IS NOT VALID";
                    break;
                }
            } else if ((INPUT_TYPE === EnumConstant.FORM.INPUT || INPUT_TYPE === EnumConstant.FORM.EDITOR || INPUT_TYPE === EnumConstant.FORM.TEXTAREA) && (input[NAME] === undefined || (typeof input[NAME] === 'string' && !input[NAME].length) || (typeof input[NAME] === 'number' && isNaN(input[NAME])))) {
                isError = true;
                message = `${LABEL?.toUpperCase()} IS REQUIRED`;
                break;
            } else if (INPUT_TYPE === EnumConstant.FORM.FILE && !input[NAME]) {
                isError = true;
                message = 'PLEASE SELECT IMAGE';
                break;
            }
        }
    }

    if (isError) {
        return { STATUS: false, MESSAGE: message }
    } else {
        return { STATUS: true }
    }
}