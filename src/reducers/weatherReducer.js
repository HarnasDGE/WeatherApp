import { SET_NAME_OF_PLACE, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS, SET_TIME_OF_DAY, SET_IMAGE_LINK, SET_FAVORITE_PLACE, FETCH_DATA_LOCALSTORE_FAVORITEPLACES, UPDATE_ALL_DATA, REMOVE_FAVORITE_PLACE, UPDATE_ALL_FAVORITE_PLACES, CHANGE_CONTENT, FETCH_FORECAST } from "../constans/constans";

const defaultState = ["?", "?", "?", "?", "?"];

const initialState = {
    data: {
        daily: {
            time: defaultState,
            weatherCode: defaultState,
            temperatureMax: defaultState,
            temperatureMin: defaultState,
            sunrise: defaultState,
            sunset: defaultState,
            daylightDuration: defaultState,
            sunshineDuration: defaultState,
            uvIndexMax: defaultState,
            uvIndexClearSkyMax: defaultState,
            precipitationSum: defaultState,
            rainSum: defaultState,
            showersSum: defaultState,
            snowfallSum: defaultState,
            precipitationHours: defaultState,
            precipitationProbabilityMax: defaultState,
            windSpeed: defaultState,
            windGusts: defaultState,
            windDirection: defaultState,
        },
        main: {
            lat: "?",
            lon: "?",
            name: "?",
            country: "?",
            countryCode: "?"
        },
        hourly: {
            time: defaultState,
            temperature2m: defaultState,
            precipitationProbability: defaultState,
            precipitation: defaultState,
            rain: defaultState,
            shower: defaultState,
            snowfall: defaultState,
            weatherCode: defaultState,
            cloudCover: defaultState
        }
    },
    errorMessage: '',
    timeOfDay: '',
    nameOfPlace: '',
    imageLink: '',
    favoritePlaces: [],
    actualContent: 'Main Info',
    forecast: [],
}

export const weatherReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_DATA_SUCCESS:
            return {...state, data: action.payload}
        case FETCH_DATA_FAILURE:
            return {...state, errorMessage: action.payload}
        case SET_TIME_OF_DAY:
            return {...state, timeOfDay: action.timeOfDay}
        case SET_NAME_OF_PLACE: 
            return {...state, nameOfPlace: action.nameOfPlace}
        case SET_IMAGE_LINK:
            return {...state, imageLink: action.imageLink}

        case SET_FAVORITE_PLACE: 
            return {
                ...state,
                favoritePlaces: [...state.favoritePlaces, state.data ]
            };
        case REMOVE_FAVORITE_PLACE:
            return {...state, favoritePlaces: state.favoritePlaces.filter((_, index) => index !== action.index) }

        case FETCH_DATA_LOCALSTORE_FAVORITEPLACES:
            return {...state, favoritePlaces: Array.isArray(action.newFavoritePlaces) ? action.newFavoritePlaces : state.favoritePlaces
            }

        case FETCH_FORECAST: 
            return {...state, forecast: action.forecast}

        case UPDATE_ALL_DATA:
            return {
                ...state,
                data: action.allData.data,
                nameOfPlace: action.allData.nameOfPlace,
                imageLink: action.allData.imageLink,
            }
        case UPDATE_ALL_FAVORITE_PLACES:
            return {
                ...state,
                favoritePlaces: action.newFavoritePlaces,
            };

        case CHANGE_CONTENT:
            return {
                ...state, actualContent: action.titleContent
            }

        default: 
            return state;
    }

}