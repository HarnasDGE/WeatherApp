import axios from 'axios';
import { SET_FAVORITE_PLACE, SET_NAME_OF_PLACE, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS, FETCH_DATA_REQUEST, APIKEY_OPENWEATHERAPI, IMAGES_FOR_TIME_OF_DAY, SET_TIME_OF_DAY, SET_IMAGE_LINK, APIKEY_UNSPLASH, FETCH_DATA_LOCALSTORE_SAVEDPLACES, FETCH_DATA_LOCALSTORE_FAVORITEPLACES, UPDATE_ALL_DATA, REMOVE_FAVORITE_PLACE, UPDATE_ALL_FAVORITE_PLACES, CHANGE_CONTENT, FETCH_FORECAST } from '../constans/constans';


export const fetchDataRequest = () => ({
    type: FETCH_DATA_REQUEST
  });
  
  export const fetchDataSuccess = (data) => ({
    type: FETCH_DATA_SUCCESS,
    payload: data
  });
  
  export const fetchDataFailure = (error) => ({
    type: FETCH_DATA_FAILURE,
    payload: error
  });

  export const setNameOfPlace = (nameOfPlace) => ({
    type: SET_NAME_OF_PLACE,
    nameOfPlace
  })

  export const setImageLink = (imageLink) => ({
    type: SET_IMAGE_LINK,
    imageLink
  })

  export const setFavoritePlace = () => {

    return {
      type: SET_FAVORITE_PLACE
    }
  }

export const removeFavoritePlace = (index) => {
  return {
    type: REMOVE_FAVORITE_PLACE,
    index
  }
}

export const updateAllData = (allData) => ({
  type: UPDATE_ALL_DATA,
  allData
})


  export const fetchDataFavoritePlacesLocalStore = (favoritePlaces) => ({
    type: FETCH_DATA_LOCALSTORE_FAVORITEPLACES,
    favoritePlaces
  })
  
  export const fetchImageLink = (keyword) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${keyword}&client_id=${APIKEY_UNSPLASH}`);
        if (response.data.results.length > 0) {
          const imageUrl = response.data.results[0].urls.regular;
          dispatch(setImageLink(imageUrl));
        } else {
          console.log('No images found for the given keyword.');
        }
      } catch (error) {
        dispatch(fetchDataFailure(`(error)fetchImageLink ${error.message}`));
      }
    };
  }

  export const fetchDataPlace = (placeInformation) => {
    return async (dispatch) => {
      dispatch(fetchDataRequest());
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${placeInformation.lat}&lon=${placeInformation.lon}&appid=${APIKEY_OPENWEATHERAPI}`);
        dispatch(fetchDataSuccess(response.data));
        dispatch(setTimeOfDay(response.data.dt, response.data.timezone));
        dispatch(fetchForecast(response.data));
      } catch (error) {
        dispatch(fetchDataFailure(error.message));
      }
    };
  };

  export const fetchPlaceInformation = (place) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`);
        const placeInformation = {
          lat: response.data[0].lat,
          lon: response.data[0].lon
        }
        dispatch(setNameOfPlace(response.data[0].name));
        dispatch(fetchImageLink(response.data[0].name));
        dispatch(fetchDataPlace(placeInformation));
      } catch (error) {
        console.error(`(error)fetchPlaceInformation ` + error.message);
      }
    };
  }

  export const setTimeOfDay = (time, timezone) => {
    const dataInMs = time*1000;
    const date = new Date(dataInMs);

    const timezoneOffsetInHours = timezone / 3600;
    let hours = date.getUTCHours() + timezoneOffsetInHours;
    hours = (hours + 24) % 24; // Normalizacja do zakresu 0-24

    const actualTimeOfDay = IMAGES_FOR_TIME_OF_DAY.find(day => day[0] <= hours && day[1] >= hours);
    return {
      type: SET_TIME_OF_DAY,
      timeOfDay: actualTimeOfDay[2]
    }
  }
  

  export const updateAllFavoritePlaces = (newFavoritePlaces) => ({
    type: UPDATE_ALL_FAVORITE_PLACES,
    newFavoritePlaces,
});

export const changeContent = (titleContent) => ({
  type: CHANGE_CONTENT,
  titleContent
})

export const setForecast = (forecast) => ({
  type: FETCH_FORECAST,
  forecast
})

export const fetchForecast = (place) => {
  const { lat, lon } = place.coord;
   return async (dispatch) => {
    const units = 'metric';
    let forecast = [];
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY_OPENWEATHERAPI}&units=${units}`);
      forecast = response.data;
      dispatch(setForecast(forecast));
    } catch (error) {
      console.log(`(error)fetchForecast` + error.message);
    }
  };
}