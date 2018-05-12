/**
 * Function to switch the button enable <-> disable
 * @param element A JQuery element
 * @param action What do you want to do?
 *          True = Button ENABLED  -  False = Button DISABLED
 */

export function toggleBtn(element: JQuery<HTMLElement>, action: boolean) {
    element.prop("disabled", !action);
    if (action) {
        element.removeClass("disabled");
    } else {
        element.addClass("disabled");
    }
}