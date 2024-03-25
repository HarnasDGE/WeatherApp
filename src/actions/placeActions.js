import { APIKEY_OPENWEATHERAPI, FETCH_PLACE_FAILURE, FETCH_PLACE_REQUEST, FETCH_PLACE_SUCCESS } from "../constans/constans";
import { fetchDataPlace, fetchImageLink, setNameOfPlace } from "./actionsWeather";

export const togglePlaceRequest = () => ({
    type: FETCH_PLACE_REQUEST,
})

export const setPlaceData = (data) => ({
    type: FETCH_PLACE_SUCCESS,
    payload: data
})

export const setErrorMessage = (message) => ({
    type: FETCH_PLACE_FAILURE,
    payload: message
})

export const fetchPlaceInformation = (place) => {
    return async (dispatch) => {
        dispatch(togglePlaceRequest());
      try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`);
        const placeInformation = {
          lat: response.data[0].lat,
          lon: response.data[0].lon
        }
        dispatch(setNameOfPlace(response.data[0].name));
        dispatch(fetchImageLink(response.data[0].name));
        dispatch(fetchDataPlace(placeInformation));
        dispatch(setPlaceData(response.data));
        
      } catch (error) {
        dispatch(setErrorMessage(error.message));
        console.error(`(error)fetchPlaceInformation ` + error.message);
      }
    };
  }