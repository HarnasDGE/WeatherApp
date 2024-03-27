import { POPUP_CONFIRM, SHOW_NOTIFICATION } from "../constans/constans"

const initialState = {
    popup: {
        message: "",
        type: POPUP_CONFIRM
    }
}


export const notificationReducer = (state = initialState, action) => {
    switch(action.type) {
        case SHOW_NOTIFICATION:
        return {...state, 
            popup: {
                message: action.popup.message,
                type: action.popup.type
            }
        }
        default:
            return state;

    }
}