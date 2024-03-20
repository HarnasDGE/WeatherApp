import {  updateAllFavoritePlaces, updateAllData,fetchDataSuccess, fetchPlaceInformation, setFavoritePlace, fetchDataSavedPlacesLocalStore, fetchDataFavoritePlacesLocalStore, removeFavoritePlace} from "../actions/actionsWeather";

export const mapStateToProps = (state) => {
    return {
      data: state.weatherState.data,
      errorMessage: state.weatherState.errorMessage,
      timeOfDay: state.weatherState.timeOfDay,
      nameOfPlace: state.weatherState.nameOfPlace,
      imageLink: state.weatherState.imageLink,
      favoritePlaces: state.weatherState.favoritePlaces
    }
  };
  
  export const mapDispatchToProps = (dispatch) => {
    return {
      fetchPlaceInformation: (place) => dispatch(fetchPlaceInformation(place)),
      setFavoritePlace: () => dispatch(setFavoritePlace()),
      fetchDataSavedPlacesLocalStore: (savedPlaces) => dispatch(fetchDataSavedPlacesLocalStore(savedPlaces)),
      fetchDataFavoritePlacesLocalStore: (favoritePlaces) => dispatch(fetchDataFavoritePlacesLocalStore(favoritePlaces)),
      fetchDataSuccess: (data) => dispatch(fetchDataSuccess(data)),
      updateAllData: (allData) => dispatch(updateAllData(allData)),
      removeFavoritePlace: (index) => dispatch(removeFavoritePlace(index)),
      updateAllFavoritePlaces: (updatedPlaces) => dispatch(updateAllFavoritePlaces(updatedPlaces)),
    }
  };
  