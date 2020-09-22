"use strict";
/**
 * Function to switch the button enable <-> disable
 * @param element A JQuery element
 * @param action What do you want to do?
 *          True = Button ENABLED  -  False = Button DISABLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBtn = void 0;
function toggleBtn(element, action) {
    element.prop("disabled", !action);
    if (action) {
        element.removeClass("disabled");
    }
    else {
        element.addClass("disabled");
    }
}
exports.toggleBtn = toggleBtn;
//# sourceMappingURL=toggleBtn.js.map