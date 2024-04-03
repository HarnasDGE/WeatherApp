import { SET_CONTROL_POINTS, SET_COORDS, SET_ROUTE, SET_WEATHER_ON_ROUTE } from "../constans/constans"

const initialState = {
    route: [],
    weatherOnRoute: [],
    coords: {},
    controlPoints: 5

}

export const roadReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ROUTE:
            return {...state, route: action.route}
        case SET_WEATHER_ON_ROUTE:
            return {...state, weatherOnRoute: action.weatherOnRoute}
        case SET_COORDS:
            return {...state, coords: action.coords}
        case SET_CONTROL_POINTS:
            return {...state, controlPoints: action.controlPoints}
        default:
            return state;
    }
}