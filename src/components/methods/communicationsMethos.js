import { POPUP_ALERT, POPUP_CONFRIM, POPUP_ERROR, POPUP_INFO } from "../../constans/constans";

export const displayInfo = (info, type) => {

    const popup = document.getElementById("popup-display");

    let styleType = "";
    let iconType = "";

    switch(type) {
        case POPUP_ALERT: 
            styleType = "alert-popup"
            iconType = "warning"
        break;
        case POPUP_CONFRIM: 
            styleType = "confirm-popup"
            iconType = "check_circle"
        break;
        case POPUP_ERROR: 
            styleType = "error-popup"
            iconType = "error"
        break;
        case POPUP_INFO: 
            styleType = "info-popup"
            iconType = "info"
        break;
    }

    popup.innerHTML = `
        <span class="material-symbols-outlined popup-display-icon ${styleType}" >${iconType}</span>
        <span class='popup-display-text'>${info}</span>
    `;

    popup.style.display = "block";

    setTimeout(() => {popup.style.display = "none";}, 400);
}