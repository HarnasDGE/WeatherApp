import axios from 'axios';
import { SET_FAVORITE_PLACE, SET_NAME_OF_PLACE, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS, FETCH_DATA_REQUEST, APIKEY_OPENWEATHERAPI, IMAGES_FOR_TIME_OF_DAY, SET_TIME_OF_DAY, SET_IMAGE_LINK, APIKEY_UNSPLASH, FETCH_DATA_LOCALSTORE_SAVEDPLACES, FETCH_DATA_LOCALSTORE_FAVORITEPLACES, UPDATE_ALL_DATA, REMOVE_FAVORITE_PLACE, UPDATE_ALL_FAVORITE_PLACES, CHANGE_CONTENT, FETCH_FORECAST, SHOW_NOTIFICATION, POPUP_ERROR, POPUP_INFO } from '../constans/constans';
import { showNotification } from './notificationActions';
import { fetchWeatherApi } from 'openmeteo';
  
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
          dispatch(showNotification('No images found for this place!', POPUP_ERROR));
        }
      } catch (error) {
        dispatch(showNotification('Error communicating with the Image API', POPUP_ERROR));
      }
    };
  }

  export const fetchDataPlace = (placeInformation) => {
    return async (dispatch) => {
      const now = new Date();
      const startDate = now.toISOString().substring(0,10);
      let endDate = new Date();
      endDate.setDate(now.getDate() + 4);
      endDate = endDate.toISOString().substring(0,10);
      
      try {
        const params = {
          latitude: placeInformation.lat,
          longitude: placeInformation.lon,
          hourly: "temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover",
          daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
          start_date: startDate,
          end_date: endDate
        };
  
        const url = `https://api.open-meteo.com/v1/forecast`;
        const responses = await fetchWeatherApi(url, params);
        
        const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const response = responses[0];
          // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        const daily = response.daily();
        const defaultArr = ["?", "?", "?", "?", "?"];
          // Note: The order of weather variables in the URL query and the indices below need to match!
        const data = {
          main: {
            lat: placeInformation.lat.toString().substring(0,5) || "?",
            lon: placeInformation.lon.toString().substring(0,5) || "?",
            name: placeInformation.name || "?",
          },
            hourly: {
              time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString()
              ),
              temperature2m: hourly.variables(0).valuesArray() || [],
              precipitationProbability: hourly.variables(1).valuesArray() || [],
              precipitation: hourly.variables(2).valuesArray() || [],
              rain: hourly.variables(3).valuesArray() || [],
              showers: hourly.variables(4).valuesArray() || [],
              snowfall: hourly.variables(5).valuesArray() || [],
              weatherCode: hourly.variables(6).valuesArray() || [],
              cloudCover: hourly.variables(7).valuesArray() || [],
            },
            daily: {
              time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString()
              ),
              weatherCode: daily.variables(0).valuesArray() || defaultArr,
              temperatureMax: daily.variables(1).valuesArray() || defaultArr,
              temperatureMin: daily.variables(2).valuesArray() || defaultArr,
              sunrise: daily.variables(3).valuesArray() || defaultArr,
              sunset: daily.variables(4).valuesArray() || defaultArr,
              daylightDuration: daily.variables(5).valuesArray() || defaultArr,
              sunshineDuration: daily.variables(6).valuesArray() || defaultArr,
              uvIndexMax: daily.variables(7).valuesArray().toString().substring(0,4) || defaultArr,
              uvIndexClearSkyMax: daily.variables(8).valuesArray().toString().substring(0,4) || defaultArr,
              precipitationSum: daily.variables(9).valuesArray() || defaultArr,
              rainSum: daily.variables(10).valuesArray() || defaultArr,
              showersSum: daily.variables(11).valuesArray() || defaultArr,
              snowfallSum: daily.variables(12).valuesArray() || defaultArr,
              precipitationHours: daily.variables(13).valuesArray() || defaultArr,
              precipitationProbabilityMax: daily.variables(14).valuesArray() || defaultArr,
              windSpeedMax: daily.variables(15).valuesArray().toString().substring(0,5) || defaultArr,
              windGustsMax: daily.variables(16).valuesArray() || defaultArr,
              windDirectionDominant: daily.variables(17).valuesArray() || defaultArr,
            },
          };

          console.log(`actionWeather`);
          console.table(data);
          dispatch(fetchDataSuccess(data));
      } catch (error) {
        dispatch(showNotification('Error communicating with Open-Meteo', POPUP_ERROR));
        console.error(`Error from fetchWeatherDataForPlace: `, error.message);
      }
    };
  };
  

  export const fetchPlaceInformation = (place) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`);
        const placeInformation = {
          name: response.data[0].name,
          lat: response.data[0].lat,
          lon: response.data[0].lon
        }
        dispatch(setNameOfPlace(response.data[0].name));
        dispatch(fetchImageLink(response.data[0].name));
        dispatch(fetchDataPlace(placeInformation));
      } catch (error) {
        dispatch(showNotification('Error communicating with OpenWeather (Place Information)', POPUP_ERROR));
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
      dispatch(showNotification('The forecast has been loaded', POPUP_INFO));
    } catch (error) {
      dispatch(showNotification('Error communicating with OpenWeather (Forecast)', POPUP_ERROR));
    }
  };
}

