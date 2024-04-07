import { CHANGE_MAIN_ROUTE, SET_ALTERNATIVE_ROUTES, SET_CONTROL_POINTS, SET_COORDS, SET_ROUTE, SET_ROUTE_TYPE, SET_WEATHER_ON_ROUTE } from "../constans/constans"

const initialState = {
    route: [],
    weatherOnRoute: [],
    coords: {
        from: {},
        to: {}
    },
    alternativeRoutes: [],
    controlPoints: 5,
    routeType: "fastest"
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
        case SET_ALTERNATIVE_ROUTES:
            return {...state, alternativeRoutes: action.alternativeRoutes}
        case SET_ROUTE_TYPE:
            return {...state, routeType: action.routeType}

        case CHANGE_MAIN_ROUTE: 
            return {...state, route: action.route, weatherOnRoute: action.weatherOnRoute}
        default:
            return state;
    }
}