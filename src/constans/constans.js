export const PLACE_WEATHER = "PLACE_WEATHER";
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const FETCH_FORECAST = "FETCH_FORECAST";

export const FETCH_DATA_LOCALSTORE_FAVORITEPLACES = "FETCH_DATA_LOCALSTORE_FAVORITEPLACES";

export const APIKEY_WEATHERAPI = 'bf1e6dd40be64818b91194314241802';
export const APIKEY_OPENWEATHERAPI = "369e88b4de43f6925b8768c4f05abba3";
export const APIKEY_UNSPLASH = "8JTwwjCpaxY_nIxvXVfGvyreY2JA4C3andfKBzjFsb0";
export const APIKEY_TOMTOM = "aMKVzqJStDSA14LaTTAYKHcjN2C2FZwp";

export const SET_TIME_OF_DAY = "SET_TIME_OF_DAY"
export const SET_NAME_OF_PLACE = "SET_NAME_OF_PLACE";
export const SET_IMAGE_LINK = "SET_IMAGE_LINK";

export const SET_CONTROL_POINTS = "SET_CONTROL_POINTS";

export const SET_ROUTE = "SET_ROUTE";
export const SET_ROUTE_TYPE = "SET_ROUTE_TYPE";
export const SET_ALTERNATIVE_ROUTES = "SET_ALTERNATIVE_ROUTES";
export const SET_WEATHER_ON_ROUTE = "SET_WEATHER_ON_ROUTE";
export const SET_FAVOURITE_ROUTE = "SET_FAVOURITE_ROUTE";
export const LOAD_SPECIFIC_ROUTE = "LOAD_FAVOURITE_ROUTE";
export const REMOVE_FAVORITE_ROUTE = "REMOVE_FAVORITE_ROUTE"
export const SET_COORDS = "SET_COORDS";
export const CHANGE_MAIN_ROUTE = "CHANGE_MAIN_ROUTE";

export const SET_FAVORITE_PLACE = "SET_FAVORITE_PLACE";
export const REMOVE_FAVORITE_PLACE = "REMOVE_FAVORITE_PLACE";

export const UPDATE_ALL_DATA = "UPDATE_ALL_DATA";
export const UPDATE_ALL_FAVORITE_PLACES = 'UPDATE_ALL_FAVORITE_PLACES';

export const REFRESH_DATA = "REFRESH_DATA";
export const REFRESH_FAVOURITE_PLACES = "REFRESH_FAVOURITE_PLACES";

export const CHANGE_CONTENT = "CHANGE_CONTENT";
export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";

export const IMAGES_FOR_TIME_OF_DAY = [
    [6, 10, "morning"],
    [11, 15, "midday"],
    [16, 19, "evening"],
    [20, 22, "moonrise"],
    [23, 1, "midnight"],
    [2, 5, "moonset"]
]

export const FETCH_PLACE_SUCCESS = "FETCH_PLACE_SUCCESS";
export const FETCH_PLACE_FAILURE = "FETCH_DATA_FAILURE";
export const FETCH_PLACE_REQUEST = "FETCH_PLACE_REQUEST";

export const POPUP_INFO = "POPUP_INFO";
export const POPUP_ALERT = "POPUP_ALERT";
export const POPUP_ERROR = "POPUP_ERROR";
export const POPUP_CONFIRM = "POPUP_CONFIRM";

export const USED_API = [
    {name: "Open-Meteo", desc: "Information about weather and geocoding", url: "https://open-meteo.com/"},
    {name: "OpenWeatherMap", desc: "Information about weather and geocoding", url: "https://openweathermap.org/"},
    {name: "Tom-Tom", desc: "Information about routes and times", url: "https://developer.tomtom.com/"},
    {name: "Unsplash", desc: "Images, images and images", url: "https://unsplash.com/"},
]