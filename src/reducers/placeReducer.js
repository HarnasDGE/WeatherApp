import { FETCH_PLACE_SUCCESS, FETCH_PLACE_FAILURE, FETCH_PLACE_REQUEST } from "../constans/constans"

const initialState = {
    place: [],
    errorMessage: "",
    isLoading: false,
    placesRoute: {
        from: [],
        to: []
    },
    
}

export const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_PLACE_SUCCESS:
            return {...state, place: action.payload}
        case FETCH_PLACE_FAILURE:
            return {...state, errorMessage: action.payload}
        case FETCH_PLACE_REQUEST:
            return {...state, isLoading: !state.isLoading}
        default:
            return state;
    }
}