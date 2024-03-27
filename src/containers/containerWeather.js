import {  updateAllFavoritePlaces, updateAllData,fetchDataSuccess, fetchPlaceInformation, setFavoritePlace, fetchDataSavedPlacesLocalStore, fetchDataFavoritePlacesLocalStore, removeFavoritePlace, changeContent, fetchForecast} from "../actions/actionsWeather";
import { showNotification } from "../actions/notificationActions";
export const mapStateToProps = (state) => {
    return {
      data: state.weatherState.data,
      errorMessage: state.weatherState.errorMessage,
      timeOfDay: state.weatherState.timeOfDay,
      nameOfPlace: state.weatherState.nameOfPlace,
      imageLink: state.weatherState.imageLink,
      favoritePlaces: state.weatherState.favoritePlaces,
      actualContent: state.weatherState.actualContent,
      forecast: state.weatherState.forecast,
      popup: state.notificationState.popup,
    }
  };
  
  export const mapDispatchToProps = (dispatch) => {
    return {
      fetchPlaceInformation: (place) => dispatch(fetchPlaceInformation(place)),
      setFavoritePlace: () => dispatch(setFavoritePlace()),
      fetchDataFavoritePlacesLocalStore: (favoritePlaces) => dispatch(fetchDataFavoritePlacesLocalStore(favoritePlaces)),
      fetchDataSuccess: (data) => dispatch(fetchDataSuccess(data)),
      updateAllData: (allData) => dispatch(updateAllData(allData)),
      removeFavoritePlace: (index) => dispatch(removeFavoritePlace(index)),
      updateAllFavoritePlaces: (updatedPlaces) => dispatch(updateAllFavoritePlaces(updatedPlaces)),
      changeContent: (titleContent) => dispatch(changeContent(titleContent)),
      fetchForecast: (forecast) => dispatch(fetchForecast(forecast)),
      showNotification: (message, type) => dispatch(showNotification(message, type)),
    }
  };
  