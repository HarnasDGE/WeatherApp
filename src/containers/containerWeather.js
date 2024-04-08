import {  updateAllFavoritePlaces, updateAllData,fetchDataSuccess, fetchPlaceInformation, setFavoritePlace, fetchDataSavedPlacesLocalStore, fetchDataFavoritePlacesLocalStore, removeFavoritePlace, changeContent, fetchForecast} from "../actions/actionsWeather";
import { showNotification } from "../actions/notificationActions";
import { setFavoriteRoute, fetchWeatherInformation, fetchRoute, setControlPoints, fetchAllDataAboutRoute, setRouteType, changeMainRoute } from "../actions/roadActions";
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
      route: state.roadState.route,
      weatherOnRoute: state.roadState.weatherOnRoute,
      coords: state.roadState.coords,
      controlPoints: state.roadState.controlPoints,
      routeType: state.roadState.routeType,
      favoriteRoutes: state.roadState.favoriteRoutes,
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
      fetchRoute: (getStartPoint, getEndPoint) => dispatch(fetchRoute(getStartPoint, getEndPoint)),
      fetchAllDataAboutRoute: (getStartPoint, getEndPoint) => dispatch(fetchAllDataAboutRoute(getStartPoint, getEndPoint)),
      fetchWeatherInformation: () => dispatch(fetchWeatherInformation()),
      setControlPoints: (controlPoints) => dispatch(setControlPoints(controlPoints)),
      setRouteType: (routeType) => dispatch(setRouteType(routeType)),
      changeMainRoute: (index) => dispatch(changeMainRoute(index)),
      setFavoriteRoute: () => dispatch(setFavoriteRoute()),
    }
  };
  